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

async function test() {
  console.log("Logging in...");
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: '421105991@qu.edu.sa',
    password: 'QUPassword123!'
  });

  const userId = authData?.user?.id;
  console.log("Logged in user:", userId);

  // Recipient will be the other demo user we signed up earlier (test1001)
  const recipientId = '215b6325-c31e-46ca-96fd-7a0dfe0ae11f';

  console.log(`Inserting connection: requester_id=${userId}, recipient_id=${recipientId}, status='pending'...`);
  const { data, error } = await supabase.from('connections').insert({
    requester_id: userId,
    recipient_id: recipientId,
    status: 'pending'
  }).select();

  if (error) {
    console.error("Insert failed:", error);
  } else {
    console.log("Insert SUCCEEDED! Row:", data);
    // Cleanup
    const del = await supabase.from('connections').delete().eq('id', data[0].id);
    console.log("Cleaned up connection:", del.error ? del.error.message : "Success");
  }
}

test();
