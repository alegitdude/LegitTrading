import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bvfpeidzypyrjeewotyy.supabase.co";
const supabase = createClient(
  supabaseUrl,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZnBlaWR6eXB5cmplZXdvdHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTIyMzE1MTIsImV4cCI6MjAwNzgwNzUxMn0.s26pnnnyf5a_VlPqdMSqpLeTkdR648i5UvLSMv79qHk"
);

export default supabase;
