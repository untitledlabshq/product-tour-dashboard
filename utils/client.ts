import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://pualfqvlljzjrdpsrcwy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1YWxmcXZsbGp6anJkcHNyY3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODcwMTEwMTcsImV4cCI6MjAwMjU4NzAxN30.v3JFuKE6MdoWZDUxW8jdIzYCnrFAJ0k_zuTooUGFNyk"
);
