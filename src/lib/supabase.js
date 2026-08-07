import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tasaixjwlothmqgvaenv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhc2FpeGp3bG90aG1xZ3ZhZW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0ODMwNTcsImV4cCI6MjEwMDA1OTA1N30.Pcl7qIVJGoKMTyJD7rrNmqSDHfMatrpOmIFdAjwL4yg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload asset preview to Supabase Storage Bucket ('public-previews')
 */
export async function uploadToSupabaseStorage(file, path) {
  try {
    const { data, error } = await supabase.storage
      .from('public-previews')
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('public-previews')
      .getPublicUrl(path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Error uploading to Supabase Storage:", err);
    return null;
  }
}
