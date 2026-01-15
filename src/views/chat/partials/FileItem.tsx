import type { FileItem as FileItemType } from '../../../types/interfaces/IFileItem';
import { getFileBg } from '../../../helpers/BackgroundFileHelper';
import type React from 'react';
import { useState } from 'react';
import { Download, X } from 'lucide-react';

interface Props {
  file: FileItemType;
}

const FileItem = ({ file }: Props) => {
  const [selectedImage, setSelectedImage] = useState<{ imageUrl: string, name: string } | null>(null);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (file.url) {
      downloadFile(file.url, file.name);
    }
  }

  async function downloadFile(url: string, fileName: string) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "Download";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.log("Download Failed", error);
    }
  }

  return (<>
    <div className="flex items-center gap-3 p-3 hover:bg-[var(--bg-hover)] rounded-lg cursor-pointer group transition-colors">

      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 ${getFileBg(file.type)}`}
        onClick={() => setSelectedImage({
          imageUrl: file.url,
          name: file.name
        })}

      >
        {file.icon}
      </div>

      <div className="flex-1 min-w-0"
        onClick={() => setSelectedImage({
          imageUrl: file.url,
          name: file.name
        })}
      >
        <h4 className="font-medium text-gray-800 text-sm text-[var(--text-primary)] truncate">
          {file.name}
        </h4>
        <p className="text-xs  text-[var(--text-muted)]">
          {file.type} · {file.size}
        </p>
      </div>

      <button className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-muted)] transition-all"
        onClick={handleDownload}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3
             m2 8H7a2 2 0 01-2-2V5
             a2 2 0 012-2h5.586
             a1 1 0 01.707.293l5.414
             5.414a1 1 0 01.293.707V19
             a2 2 0 01-2 2z" />
        </svg>
      </button>
    </div>
    {selectedImage && (
      <div
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedImage(null)}
      >
        {/* Nút đóng */}
        <button
          className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors"
          onClick={() => setSelectedImage(null)}
        >
          <X size={40} />
        </button>

        {/* Nội dung ảnh */}
        <div className="relative max-w-[90%] max-h-[85vh] flex flex-col items-center">
          <img
            src={selectedImage.imageUrl}
            alt="Zoomed"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} // Click vào ảnh thì không đóng
          />
          <p className="mt-4 text-white text-lg font-medium">{selectedImage.name}</p>
        </div>
        <div className="absolute bottom-10 flex gap-4">
          <a
            href={selectedImage.imageUrl}
            download
            target="_blank"
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full flex items-center gap-2 backdrop-blur-md transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={18} />
            Tải xuống
          </a>
        </div>
      </div>

    )
    }
  </>
  );
}

export default FileItem;
