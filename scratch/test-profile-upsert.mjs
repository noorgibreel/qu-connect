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

async function run() {
  const email = `test-1786901226665@qu.edu.sa`;
  const password = 'TestPassword123!';

  console.log('Signing in user:', email);
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInErr) {
    console.error('Sign in error:', signInErr.message);
    return;
  }

  const userId = signInData.user?.id;
  console.log('Signed in successfully, User ID:', userId);

  // Try to insert into profiles
  console.log('Trying to insert profile...');
  const { data: profData, error: profErr } = await supabase.from('profiles').insert({
    id: userId,
    first_name: 'أحمد',
    academic_level: 6,
    student_id: '421105991'
  }).select();

  if (profErr) {
    console.log('Upsert profile error:', profErr.message, profErr.details);
  } else {
    console.log('Upsert profile success! Data:', profData);
  }
}

run();
