import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// The browser already provides a synchronous `localStorage`, so supabase-js
// uses it automatically — no expo-sqlite storage adapter needed here (its
// web backend runs SQLite in a WASM worker, which Metro's dev server can't
// chunk-split, so it only ever gets pulled in on native via supabase.native.ts).
export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: false,
  },
});
