import { useEffect, useState } from "react";
import fetchLinkPreview from "../services/linkPreviewService";
import { FileText } from "lucide-react";

const CARD_WIDTH = "w-full max-w-[300px]";
const IMAGE_HEIGHT = "h-36";

export default function LinkPreview({
  url,
  isMe,
}: {
  url: string;
  isMe: boolean;
}) {
  const [data, setData] = useState<any>(null);

  const isFileUrl = (url: string) => {
    const fileExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".mp4",
      ".mp3",
      ".avi",
      ".mov",
    ];
    return fileExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const getFileName = (url: string) => {
    return url.substring(url.lastIndexOf("/") + 1);
  };

  const isFile = isFileUrl(url);
  useEffect(() => {
    if (isFile) return; // Skip fetching preview for direct file links

    fetchLinkPreview(url)
      .then((previewData) => setData(previewData))
      .catch((err) => console.error("Error fetching link preview:", err));
  }, [url, isFile]);

  if (isFile) {
    const fileName = getFileName(url);
    const extension = fileName.split(".").pop()?.toUpperCase() || "FILE";

    return (
      <div
        onClick={() => window.open(url, "_blank")}
        className={`
          ${CARD_WIDTH}
          flex items-center gap-3 p-3 mt-2 mb-1 
          border rounded-xl cursor-pointer transition-colors
          ${
            isMe
              ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
              : "bg-white border-gray-200 hover:bg-gray-50 text-gray-800"
          }
        `}
      >
        {/* Icon File */}
        <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
          <FileText size={24} />
        </div>

        {/* Thông tin file */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate" title={fileName}>
            {fileName}
          </h4>
          <p
            className={`text-[10px] uppercase ${isMe ? "text-white/70" : "text-gray-500"}`}
          >
            {extension} • Nhấn để xem
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      className={`
          ${CARD_WIDTH}
        border rounded-xl overflow-hidden cursor-pointer transition-all hover:opacity-90 bg-white
        ${isMe ? "rounded-tr-none" : "rounded-tl-none"} /* Bo góc tuỳ theo bên nào gửi */
        shadow-sm 
      `}
      onClick={() => window.open(data.url, "_blank")}
    >
      {data.image && (
        <div className={`${IMAGE_HEIGHT} w-full overflow-hidden`}>
          <img
            src={data.image}
            alt="preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-3 bg-gray-50 border-t">
        <h4 className="font-bold text-sm text-gray-800 line-clamp-1">
          {data.title}
        </h4>
        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
          {data.description}
        </p>
        <span className="text-[10px] text-gray-400 mt-2 block uppercase">
          {new URL(data.url).hostname}
        </span>
      </div>
    </div>
  );
}
