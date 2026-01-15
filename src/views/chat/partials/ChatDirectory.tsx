import DirectoryHeader from "../partials/DirectoryHeader";
import TeamMemberItem from "../partials/TeamMemberItem";
import FileItem from "../partials/FileItem";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useEvent } from "../../../hooks/useEvent";
import { supabaseClient } from "../../../services/supabaseService";
import { useSelector } from "react-redux";
import { selectGroupMembers } from "../../../stores/groupMembersSlice";

const ChatDirectory = () => {
  const params = useParams();
  const [previewFiles, setPreviewFiles] = useState<any[]>([])
  const [allFiles, setAllFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const receiver = params.name;
  const type = params.type;
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"FILES" | "MEDIA">("MEDIA");
  
  // Lấy danh sách thành viên nhóm từ Redux store
  const groupMembers = useSelector(selectGroupMembers);
  const isGroup = Number(type) === 1;

  const fetchFiles = async (limit?: number) => {
    const sender = localStorage.getItem("USER_NAME") || "";
    const to = receiver;
    setLoading(true);
    const supabase = supabaseClient;
    let query = supabase.from("chat_files")
      .select("*")
      .or(`and(sender.eq."${sender}",receiver.eq."${to}"),and(sender.eq."${to}",receiver.eq."${sender}")`)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

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
      if (limit) {
        setPreviewFiles(formattedFiles);
      } else {
        setAllFiles(formattedFiles);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    if (receiver) {
      fetchFiles(5);
    }
  }, [receiver]);

  const handleShowAll = () => {
    setLoading(true);
    setShowModal(true);
    setActiveTab("MEDIA");
    fetchFiles();
  };

  // Listen for file updates
  useEvent("updateChatFiles", (data: any) => {
    if (!data) return;
    if (data.sender === receiver || data.receiver === receiver) {
      fetchFiles(5);
    }
    if (showModal) {
      fetchFiles();
    }
  });

  const isMedia = (file: any) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const mediaExtensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'mkv'];
    return mediaExtensions.includes(ext);
  };

  const { media, nonMedia } = useMemo(() => {
    const media = allFiles.filter(isMedia);
    const nonMedia = allFiles.filter(f => !isMedia(f));
    return { media, nonMedia };
  }, [allFiles]);


  return (
    <div className="w-80 bg-[var(--bg-primary)] border-l border-[var(--border-primary)] h-screen overflow-y-auto">
      <DirectoryHeader />

      {/* Team Members - Chỉ hiển thị khi là nhóm (type = 1) */}
      {isGroup && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">Thành viên</h3>
            <span className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-1 rounded-full">
              {groupMembers.length}
            </span>
          </div>

          <div className="space-y-3">
            {groupMembers.length > 0 ? (
              groupMembers.map((member) => (
                <TeamMemberItem 
                  key={member.id} 
                  member={{
                    id: member.id,
                    name: member.name,
                    role: "",
                    avatar: "👨‍💼"
                  }} 
                />
              ))
            ) : (
              <p className="text-xs text-[var(--text-muted)]">Đang tải thành viên...</p>
            )}
          </div>
        </div>
      )}

      {/* Files */}
      <div className="p-4 border-t border-[var(--border-primary)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-[var(--text-primary)]">Tập tin</h3>
          <span className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-1 rounded-full">
            {allFiles.length}
          </span>
        </div>

        <div className="space-y-2">
          {loading ? (
            <p className="text-xs text-[var(--text-muted)]">Đang tải...</p>
          ) : previewFiles.length > 0 ? (
            previewFiles.map((f) => (
              <FileItem key={f.id} file={f} />
            ))
          ) : (
            <p className="text-xs text-[var(--text-muted)]">Không có tập tin nào {receiver}</p>
          )}
        </div>
      </div>
      <div className="border-t border-[var(--border-primary)]  justify-center flex">
        <button className="p-4 text-center" onClick={() => handleShowAll()}>Xem tất cả</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-3/4 h-3/4 p-4 overflow-y-auto">

            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Tất cả tập tin</h2>
              <button onClick={() => setShowModal(false)} className="text-red-500">Đóng</button>
            </div>
            <div className="mb-4 w-full flex">
              <button
                className={`mr-2 px-4 py-2 w-[50%] rounded ${activeTab === "MEDIA" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveTab("MEDIA")}
              >
                Ảnh & Video
              </button>
              <button
                className={`px-4 py-2 rounded w-[50%] ${activeTab === "FILES" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveTab("FILES")}
              >
                Tập tin
              </button>
            </div>
            <div>
              {loading ? (
                <p className="text-xs text-[var(--text-muted)]">Đang tải...</p>
              ) : activeTab === "MEDIA" ? (
                media.length > 0 ? (
                  media.map((f) => (
                    <FileItem key={f.id} file={f} />
                  ))
                ) : (
                  <p className="text-xs text-[var(--text-muted)]">Không có tập tin media nào.</p>
                )
              ) : (
                nonMedia.length > 0 ? (
                  nonMedia.map((f) => (
                    <FileItem key={f.id} file={f} />
                  ))
                ) : (
                  <p className="text-xs text-[var(--text-muted)]">Không có tập tin nào.</p>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

export default ChatDirectory;
