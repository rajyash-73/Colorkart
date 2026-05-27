import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cjfasrvjmhkvrmcgrrnw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqZmFzcnZqbWhrdnJtY2dycm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MTM2ODcsImV4cCI6MjA5NTI4OTY4N30.Qixhfw6D5IZlb60QLXEfhhAMGw8lnoy_CyJXUR-Egwk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabasePalette = {
  id: string;
  user_id: string | null;
  name: string;
  colors: string[];
  is_public: boolean;
  likes: number;
  created_at: string;
  user_email?: string;
  user_name?: string;
};
