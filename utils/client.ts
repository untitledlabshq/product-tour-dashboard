import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://gtgifkjpgvzlvczoozju.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Z2lma2pwZ3Z6bHZjem9vemp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU3MjQwNzcsImV4cCI6MjAxMTMwMDA3N30.N3WS9-t9FshfGWXV-9wo64Kdw34-ZLrVv-WBCBaAfuY",
  {
    auth: {
      persistSession: true,
    },
  }
);
