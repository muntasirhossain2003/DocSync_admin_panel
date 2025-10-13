import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://prixdkytpfvfukgjhczx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByaXhka3l0cGZ2ZnVrZ2poY3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjAwNTIsImV4cCI6MjA3NTczNjA1Mn0._XwXXEvfoHqiSxB6YIoswa_3FacWludrBTZDpMa6xnw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
