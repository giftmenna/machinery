import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ypthzcdkdbbdqogyyhwm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwdGh6Y2RrZGJiZHFvZ3l5aHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NjIwODQsImV4cCI6MjA1ODQzODA4NH0.v1PT8dijiQ3m0q2SVahE52BJgGCU_Qa-D4ZrhS_7KF0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);