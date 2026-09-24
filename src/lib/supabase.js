import { createClient } from '@supabase/supabase-js';

/* Supabase client shared by the pages. URL and publishable key come from .env (VITE_ prefix = exposed
   to the browser, which is expected for the publishable key: access is governed by RLS policies). */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
