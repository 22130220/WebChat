import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabaseClient = createClient(supabaseUrl, supabaseKey)

async function getImageFromSupabase(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const supabase = supabaseClient;
  const { data, error } = await supabase.storage.from("webchat").upload(`chat/${fileName}`, file);

  if (error) throw error;

  const { data: urlData } = await supabase.storage.from("webchat").getPublicUrl(`chat/${fileName}`);
  return { publicUrl: urlData.publicUrl, path: data?.path || `chat/${fileName}` };
}

async function insertFileToTable(publicUrl: string, sender: string, receiver: string, file: File) {
  const supabase = supabaseClient;
  const { data, error } = await supabase
    .from("chat_files")
    .insert([
      {
        sender: sender,
        receiver: receiver,
        file_url: publicUrl,
        file_name: file.name,
        file_type: file.type,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Cannot insert file row", error);
    return null;
  }
  return data;
}

async function fetchFiles (limit?: number, receiver?: string) {
  const sender = localStorage.getItem("USER_NAME") || "";
  const to = receiver;
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
    return formattedFiles;
  }
}

export { getImageFromSupabase, insertFileToTable, fetchFiles };
