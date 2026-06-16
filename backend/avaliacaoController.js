import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('  Supabase não configurado. Upload de arquivos desativado.');
}

export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export const BUCKET_NAME = process.env.SUPABASE_BUCKET || 'catalogo-media';

export async function uploadArquivo(buffer, path, mimetype) {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      contentType: mimetype,
      upsert: true,
    });

  if (error) throw new Error(`Erro no upload: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function removerArquivo(path) {
  if (!supabase) return;
  await supabase.storage.from(BUCKET_NAME).remove([path]);
}
