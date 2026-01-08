import DirectoryHeader from "../partials/DirectoryHeader";
import TeamMemberItem from "../partials/TeamMemberItem";
import FileItem from "../partials/FileItem";
import { teamMembers } from "../../../data/TeamMemberMock";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEvent } from "../../../hooks/useEvent";
import { supabaseClient } from "../../../services/supabaseService";

const ChatDirectory = () => {
  const params = useParams();
  const [chatFiles, setChatFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const receiver = params.name;

  const fetchFiles = async () => {
    const sender = localStorage.getItem("USER_NAME") || "";
    const to = receiver;
    const supabase = supabaseClient;
    const { data, error } = await supabase.from("chat_files")
      .select("*")
      .or(`and(sender.eq."${sender}",receiver.eq."${to}"),and(sender.eq."${to}",receiver.eq."${sender}")`)
      .order('created_at', { ascending: false });
    if (error) {
      console.error("Chi tiết lỗi:", error);
    } else {
      const formattedFiles = data.map(item => ({
        id: item.id,
        name: item.file_name,
        type: item.file_type,
        size: "Unknown",
        url: item.file_url
      }));
      setChatFiles(formattedFiles);
    }
    setLoading(false);
  }

  // Fetch files when receiver changes (param change)
  useEffect(() => {
    if (receiver) {
      fetchFiles();
    }
  }, [receiver])

  // Listen for file updates
  useEvent("updateChatFiles", (data: any) => {
    if (!data) return;
    if (data.sender === receiver || data.receiver === receiver) {
      fetchFiles();
    }
  });

  return (
    <div className="w-80 bg-[var(--bg-primary)] border-l border-[var(--border-primary)] h-screen overflow-y-auto">
      <DirectoryHeader />

      {/* Team Members */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-[var(--text-primary)]">Thành viên</h3>
          <span className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-1 rounded-full">
            {teamMembers.length}
          </span>
        </div>

        <div className="space-y-3">
          {teamMembers.map((m) => (
            <TeamMemberItem key={m.id} member={m} />
          ))}
        </div>
      </div>

      {/* Files */}
      <div className="p-4 border-t border-[var(--border-primary)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-[var(--text-primary)]">Tập tin</h3>
          <span className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-1 rounded-full">
            {chatFiles.length}
          </span>
        </div>

        <div className="space-y-2">
          {loading ? (
            <p className="text-xs text-[var(--text-muted)]">Đang tải...</p>
          ) : chatFiles.length > 0 ? (
            chatFiles.map((f) => (
              <FileItem key={f.id} file={f} />
            ))
          ) : (
            <p className="text-xs text-[var(--text-muted)]">Không có tập tin nào
              {receiver}
            </p>
          )}
        </div>
      </div>
    </div>
  )
};

export default ChatDirectory;
