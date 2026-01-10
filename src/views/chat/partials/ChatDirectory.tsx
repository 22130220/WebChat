import DirectoryHeader from "../partials/DirectoryHeader";
import FileItem from "../partials/FileItem";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const ChatDirectory = () => {
  const params = useParams();
  const [chatFiles, setChatFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const receiver = params.name;

  function connectSupabase() {
    const supabaseUrl = "https://covptfzrmxcrejmnilfl.supabase.co";
    // const supabaseKey = process.env.SUPABASE_KEY
    const supabaseKey = "sb_publishable_vzIp7DswBJ1LKWlZ5Je90w_-Tz_RvRk";
    const supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
  }

  useEffect(() => {
    const fetchFiles = async () => {
      const sender = localStorage.getItem("USER_NAME") || "";
      const to = receiver;
      const supabase = connectSupabase();
      const { data, error } = await supabase
        .from("chat_files")
        .select("*")
        .or(
          `and(sender.eq."${sender}",receiver.eq."${to}"),and(sender.eq."${to}",receiver.eq."${sender}")`,
        )
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Chi tiết lỗi:", error);
      } else {
        const formattedFiles = data.map((item) => ({
          id: item.id,
          name: item.file_name,
          type: item.file_type,
          size: "Unknown",
          url: item.file_url,
        }));
        setChatFiles(formattedFiles);
      }
      setLoading(false);
    };

    if (receiver) {
      fetchFiles();
    }
  }, [receiver]);

  return (
    <div className="w-80 bg-[var(--bg-primary)] border-l border-[var(--border-primary)] h-screen overflow-y-auto">
      <DirectoryHeader />

      {/* Team Members */}

      {/* Files */}
      <div className="p-4 border-t border-[var(--border-primary)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-[var(--text-primary)]">
            Tập tin
          </h3>
          <span className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-1 rounded-full">
            {chatFiles.length}
          </span>
        </div>

        <div className="space-y-2">
          {loading ? (
            <p className="text-xs text-[var(--text-muted)]">Đang tải...</p>
          ) : chatFiles.length > 0 ? (
            chatFiles.map((f) => <FileItem key={f.id} file={f} />)
          ) : (
            <p className="text-xs text-[var(--text-muted)]">
              Không có tập tin nào
              {receiver}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDirectory;
