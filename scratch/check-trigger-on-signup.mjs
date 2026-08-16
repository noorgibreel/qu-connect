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
  const email = `trigger-test-${Date.now()}@qu.edu.sa`;
  const password = 'TestPassword123!';

  console.log('Signing up new user:', email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) {
    console.error('Sign up failed:', error.message);
    return;
  }

  const userId = data.user?.id;
  console.log('User signed up successfully. ID:', userId);

  // Check if a profile was automatically created
  console.log('Checking profiles table...');
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*').eq('id', userId);
  if (profErr) {
    console.error('Fetch profile error:', profErr.message);
  } else {
    console.log('Profiles found:', profiles);
  }
}

run();
