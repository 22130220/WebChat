import DirectoryHeader from '../partials/DirectoryHeader';
import TeamMemberItem from '../partials/TeamMemberItem';
import FileItem from '../partials/FileItem';
import { teamMembers } from '../../../data/TeamMemberMock';
import { files } from '../../../data/FileItemMock';

const ChatDirectory = () => (
  <div className="w-80 bg-white border-l border-gray-200 h-screen overflow-y-auto">
    <DirectoryHeader />

    {/* Team Members */}
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-gray-900">Team Members</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          {teamMembers.length}
        </span>
      </div>

      <div className="space-y-3">
        {teamMembers.map(m => (
          <TeamMemberItem key={m.id} member={m} />
        ))}
      </div>
    </div>

    {/* Files */}
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-gray-900">Files</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          125
        </span>
      </div>

      <div className="space-y-2">
        {files.map(f => (
          <FileItem key={f.id} file={f} />
        ))}
      </div>
    </div>
  </div>
);

export default ChatDirectory;
