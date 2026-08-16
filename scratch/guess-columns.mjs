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

const guesses = [
  'id', 'sender_id', 'receiver_id', 'user_id', 'friend_id',
  'requester_id', 'addressee_id', 'from_id', 'to_id', 'status',
  'created_at', 'updated_at', 'accepted_at'
];

async function guess() {
  console.log("Logging in...");
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: '421105991@qu.edu.sa',
    password: 'QUPassword123!'
  });

  const userId = authData?.user?.id;
  console.log("Logged in user:", userId);

  for (const col of guesses) {
    // Try to insert an object with just this column set to a dummy value (like a UUID or text)
    let val = 'pending';
    if (col.endsWith('_id')) val = userId || 'ab264278-05d4-4319-87fa-f8b3ba82bd7b';
    if (col === 'id') continue; // auto-generated
    if (col.endsWith('_at')) val = new Date().toISOString();

    const payload = {};
    payload[col] = val;

    const { error } = await supabase.from('connections').insert(payload);
    
    if (error && error.code === '42703') {
      // 42703 is undefined_column
      console.log(`Column '${col}': DOES NOT EXIST`);
    } else {
      console.log(`Column '${col}': EXISTS (Error returned: ${error ? error.code + ' - ' + error.message : 'None (Succeeded!)'})`);
    }
  }
}

guess();
