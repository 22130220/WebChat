import { showMessageNotification } from "../services/messageNotificationService";
import reactSvg from "../assets/react.svg";
import { safeDecodeURIComponent } from "../helpers/StringHelper";
import { getUserAvatars } from "../services/firebaseProfileService";

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
            try {
                parsed = JSON.parse(raw);
            } catch (e) {
                console.warn("Failed to parse mes field", e);
                if (data.data.type === 1) {
                    pubSub.publish(`receive_chat:${data.data.to}`, data);
                    showMessageNotification(
                        `Tin nhắn mới từ ${data.data.to}`,
                        data.data.mes,
                        data.data.to,
                        {
                            icon: reactSvg,
                            navigateTo: `/chat/${data.data.to}/type/${data.data.type}`,
                        }
                    );
                } else if (data.data.type === 0) {
                    pubSub.publish(`receive_chat:${data.data.name}`, data);
                    showMessageNotification(
                        `Tin nhắn mới từ ${data.data.name}`,
                        data.data.mes,
                        data.data.to,
                        {
                            icon: reactSvg,
                            navigateTo: `/chat/${data.data.name}/type/${data.data.type}`,
                        }
                    );
                }
                return;
            }
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
                    callNotification(cloned, otherItems);
                } else if (cloned.data.type === 0) {
                    pubSub.publish(`receive_chat:${cloned.data.name}`, cloned);
                    callNotification(cloned, otherItems);
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

async function callNotification(data: any, otherItems: any) {
    if (data.data.mes == null) return;
    for (const item of otherItems) {
        if (item.type === "TYPING_STATUS") continue;
        const avatar = await getUserAvatars([data.data.name])
        if (item.type === "IMAGE") {
            showMessageNotification(
                `Tin nhắn mới từ ${data.data.name}`,
                "Hình ảnh",
                data.data.name,
                {
                    icon: avatar.get(data.data.name) || reactSvg,
                    navigateTo: `/chat/${data.data.name}/type/${data.data.type}`,
                }
            );
        }
        else {
            showMessageNotification(
                `Tin nhắn mới từ ${data.data.name}`,
                safeDecodeURIComponent(item.content),
                data.data.name,
                {
                    icon: avatar.get(data.data.name) || reactSvg,
                    navigateTo: `/chat/${data.data.name}/type/${data.data.type}`,
                }
            );
        }
    }
}
