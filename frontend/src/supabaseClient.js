import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://iduczfllgzezvjhnjzad.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkdWN6ZmxsZ3plenZqaG5qemFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc1OTk4OTgsImV4cCI6MjA0MzE3NTg5OH0.pxA7rtz7iHfP21THsdN7cHCjFXeOoc1yA-mzRhkRvf0'
export const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;