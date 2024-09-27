import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://lfcvjlhlhbpvzhqodkny.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmY3ZqbGhsaGJwdnpocW9ka255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQxNjExNjQsImV4cCI6MjAzOTczNzE2NH0.u_ptBjMsf_Sj2eN1bS1oopTGczwEww4DJu4jyXoMNjg'
export const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;