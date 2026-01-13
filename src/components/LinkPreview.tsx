import { useEffect, useState } from "react";
import { fetchLinkPreview } from "../services/linkPreviewService";

export default function LinkPreview({ url, isMe }: { url: string, isMe: boolean }) {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchLinkPreview(url)
            .then(previewData => setData(previewData))
            .catch(err => console.error("Error fetching link preview:", err));
    }, [url]);

    if (!data) return null;

    return (
        <div
            className={`
        border rounded-xl overflow-hidden cursor-pointer transition-all hover:opacity-90 bg-white
        ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'} /* Bo góc tuỳ theo bên nào gửi */
        shadow-sm max-w-[300px]
      `}
            onClick={() => window.open(data.url, '_blank')}
        >
            {data.image && (
                <div className="h-32 w-full overflow-hidden">
                    <img src={data.image} alt="preview" className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-3 bg-gray-50 border-t">
                <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{data.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{data.description}</p>
                <span className="text-[10px] text-gray-400 mt-2 block uppercase">
                    {new URL(data.url).hostname}
                </span>
            </div>

        </div>
    );
}