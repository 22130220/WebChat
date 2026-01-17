import LinkPreview from "../../../components/LinkPreview";
import type { IMessageDetail } from "../../../types/interfaces/IMessageDetail";
import { extractUrl } from "../../../utils/extractUrl";

const MEDIA_STYLE = "max-w-[300px] w-full rounded-xl object-cover cursor-pointer shadow-sm";
const safeDecodeURIComponent = (str: string) => {
    try {
        if (!str || str.trim().length === 0) return "";
        if (str.includes(' ')) return str;

        return decodeURIComponent(escape(window.atob(str)));
    } catch (e) {
        return str;
    }
};

const MessageContent = ({ msg, isme, onImageClick }: { msg: IMessageDetail; isme: boolean; onImageClick: (url: string) => void }) => {

    const renderTextWithPreview = () => {
        const detectUrl = extractUrl(msg.content || "");
        return (
            <div className="flex flex-col">
                <p className="text-sm whitespace-pre-wrap break-words">{safeDecodeURIComponent(msg.content)}</p>
                {detectUrl && (
                    <div className="mt-2 -mx-1">
                        <LinkPreview url={detectUrl} isMe={isme} />
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        if (msg.type === "FORWARDED" && msg.originalType) {
            switch (msg.originalType) {
                case "IMAGE":
                    return (
                        <img
                            src={msg.content}
                            alt="Forwarded Image"
                            className={`${MEDIA_STYLE} max-h-[400px]`}
                            onClick={() => onImageClick(msg.content)}
                        />
                    );
                case "VIDEO":
                    return (
                        <video controls className={`${MEDIA_STYLE} max-h-[400px]`}>
                            <source src={msg.content} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    );
                case "AUDIO":
                    return (
                        <audio controls className="w-full max-w-[300px] mt-1">
                            <source src={msg.content} type="audio/mpeg" />
                            Your browser does not support the audio tag.
                        </audio>
                    );
                case "FILE":
                case "DOCUMENT":
                case "PDF":
                    return (
                        <div className="-mx-1">
                            <LinkPreview url={msg.content} isMe={isme} />
                        </div>
                    );
                case "TEXT":
                default:
                    return renderTextWithPreview();
            }
        }
        switch (msg.type) {
            case "TEXT":
                return renderTextWithPreview();
            case "IMAGE":
                return (
                    <img
                        src={msg.content}
                        alt="Sent Image"
                        className={`${MEDIA_STYLE} max-h-[400px]`}
                        onClick={() => onImageClick(msg.content)}
                    />
                );
            case "VIDEO":
                return (
                    <video controls className={`${MEDIA_STYLE} max-h-[400px]`}>
                        <source src={msg.content} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                );
            case "AUDIO":
                return (
                    <audio controls className="w-full max-w-[300px] mt-1">
                        <source src={msg.content} type="audio/mpeg" />
                        Your browser does not support the audio tag.
                    </audio>
                );
            case "FILE":
            case "DOCUMENT":
            case "PDF":
                return (
                    <div className="-mx-1">
                        <LinkPreview url={msg.content} isMe={isme} />
                    </div>
                );
            default:
                return <p className="text-sm">

                    {safeDecodeURIComponent(msg.content || "")}</p>;
        }
    };

    return (
        <div>
            {renderContent()}
        </div>
    );
};

export default MessageContent;