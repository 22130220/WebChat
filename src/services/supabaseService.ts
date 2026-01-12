import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

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

export { getImageFromSupabase, insertFileToTable }
export const supabaseClient = createClient(supabaseUrl, supabaseKey)
