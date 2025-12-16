import type { FileItem as FileItemType } from '../../../types/interfaces/IFileItem';
import { getFileBg } from '../../../helpers/BackgroundFileHelper';

interface Props {
  file: FileItemType;
}

const FileItem = ({ file }: Props) => (
  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group">
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 ${getFileBg(file.type)}`}
    >
      {file.icon}
    </div>

    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-sm text-gray-900 truncate">
        {file.name}
      </h4>
      <p className="text-xs text-gray-500">
        {file.type} · {file.size}
      </p>
    </div>

    <button className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-opacity">
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
);

export default FileItem;
