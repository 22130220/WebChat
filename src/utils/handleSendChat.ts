export const handleSendChat = (data: any, pubSub: any) => {
    const channel = getPublishChannel(data);
    if (!channel) {
        console.warn("No channel found for sending chat");
        return;
    }
    try {
        /**
         * raw is get mes from JSON string
         * parsed is parsed JSON object or array
         * typing items are items with type "TYPING_STATUS"
         * other items are normal message items(TEXT, IMAGE, etc)
         * if there are typing items, publish them to "typing_status" channel
         * if there are other items, publish them as normal receive_chat event
         *  81,82 (cloned.data.mes) clone data and replace mes with only other items
         * 
         *    in case else fallback to original behavior
         *  publish to receive_chat with full data
         */
        const raw = data.data?.mes;
        let parsed = null;
        if (raw) {
            parsed = JSON.parse(raw);
        }

        if (Array.isArray(parsed)) {
            const typingItems = parsed.filter((p: any) => p?.type === "TYPING_STATUS");
            const otherItems = parsed.filter((p: any) => p?.type !== "TYPING_STATUS");

            if (typingItems.length > 0) {
                typingItems.forEach((t: any) => pubSub.publish("typing_status", { data: t }));
            }

            if (otherItems.length > 0) {
                const cloned = JSON.parse(JSON.stringify(data));
                cloned.data.mes = JSON.stringify(otherItems);
                if (cloned.data.type === 1) {
                    pubSub.publish(`receive_chat:${cloned.data.to}`, cloned);
                } else if (cloned.data.type === 0) {
                    pubSub.publish(`receive_chat:${cloned.data.name}`, cloned);
                }
            }
        } else {
            if (data.data.type === 1) {
                pubSub.publish(`receive_chat:${data.data.to}`, data);
            } else if (data.data.type === 0) {
                pubSub.publish(`receive_chat:${data.data.name}`, data);
            }
        }
    } catch (e) {
        console.warn("Failed to parse SEND_CHAT message", e);
        if (data.data.type === 1) {
            pubSub.publish(`receive_chat:${data.data.to}`, data);
        } else if (data.data.type === 0) {
            pubSub.publish(`receive_chat:${data.data.name}`, data);
        }
    }
};

const getPublishChannel = (data: any) => {
    const { type, to, name } = data.data || {};
    if (type === 1) return `receive_chat:${to}`;
    if (type === 0) return `receive_chat:${name}`;
}