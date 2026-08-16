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

async function probe() {
  console.log("Probing connections table by attempting an insert...");
  // Try inserting an empty object, select the result
  const { data, error } = await supabase.from('connections').insert({}).select();
  if (error) {
    console.log("Insert failed. Error details:", error);
  } else {
    console.log("Insert succeeded! Inserted row details:", data);
    // Delete the probed dummy row
    if (data && data[0]) {
      const del = await supabase.from('connections').delete().eq('id', data[0].id);
      console.log("Cleaned up dummy row:", del.error ? del.error.message : "Success");
    }
  }
}

probe();
