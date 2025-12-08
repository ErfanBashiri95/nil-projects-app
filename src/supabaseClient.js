import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://nwiftmoqepjnroibrbpb.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWZ0bW9xZXBqbnJvaWJyYnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NTIwNjYsImV4cCI6MjA2OTAyODA2Nn0.q8xYS7rYzh79fQW9YbHzOC0lnhS_ptdH5uR1SlwlzpM"

export const supabase = createClient(supabaseUrl, supabaseKey)
