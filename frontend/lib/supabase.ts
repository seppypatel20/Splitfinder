import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://omovspdppacckrdtldpc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tb3ZzcGRwcGFjY2tyZHRsZHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDIxOTEsImV4cCI6MjA5NjAxODE5MX0.Yf4lz5023OtR-LcbZIi7UNcWwTuRHqJvE73g8l1irow";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
