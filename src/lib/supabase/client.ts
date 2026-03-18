import { createBrowserClient } from '@supabase/ssr';

const PLACEHOLDER_VALUES = ['your-supabase-url', 'your-supabase-anon-key', ''];

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  return !PLACEHOLDER_VALUES.includes(url) && !PLACEHOLDER_VALUES.includes(key) && url.startsWith('http');
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!isSupabaseConfigured()) {
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key');
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
