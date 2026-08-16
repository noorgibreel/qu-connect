import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local
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

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  const tables = ['colleges', 'majors', 'interests', 'goals', 'profiles', 'user_interests', 'user_goals', 'social_preferences'];
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(3);
      if (error) {
        console.error(`Table ${table} error:`, error.message);
      } else {
        console.log(`Table ${table} exists and has ${data.length} sample rows. Data:`, data);
      }
    } catch (e) {
      console.error(`Exception checking table ${table}:`, e);
    }
  }
}

checkTables();
