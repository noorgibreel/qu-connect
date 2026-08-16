import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking if 'connections' table exists in database...");
  const { data, error } = await supabase.from('connections').select('*').limit(1);
  if (error) {
    console.log("Error selecting from connections:", error.message);
  } else {
    console.log("Successfully selected from connections! Data:", data);
  }
}

check();
