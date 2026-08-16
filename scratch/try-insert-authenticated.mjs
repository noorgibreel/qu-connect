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
  const email = `test-${Date.now()}@qu.edu.sa`;
  const password = 'TestPassword123!';

  console.log('Signing up user:', email);
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email,
    password
  });

  if (signUpErr) {
    console.error('Sign up error:', signUpErr.message);
    return;
  }

  const userId = signUpData.user?.id;
  console.log('Signed up successfully, User ID:', userId);

  // Now try to insert into colleges
  console.log('Trying to insert college...');
  const { data: colData, error: colErr } = await supabase.from('colleges').insert({ id: 999, name_ar: 'كلية تجريبية' });
  if (colErr) {
    console.log('Insert college error:', colErr.message);
  } else {
    console.log('Insert college success!');
  }

  // Cleanup user from auth if possible (usually needs service key, but let's see if we can delete user profile)
  if (userId) {
    console.log('Trying to clean up profiles table...');
    const { error: profErr } = await supabase.from('profiles').delete().eq('id', userId);
    console.log('Profile delete status:', profErr ? profErr.message : 'success');
  }
}

run();
