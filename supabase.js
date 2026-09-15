const SUPABASE_URL = "https://musrybfkjvdwohakpihe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11c3J5YmZranZkd29oYWtwaWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTYwNzUsImV4cCI6MjEwNDM5MjA3NX0.8VVqHJO3eGll6jgj4EaHjQHP8-OSN2p7zV5neCpTNl0"; // Paste your full eyJ... key here

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
