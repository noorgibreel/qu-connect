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

const password = 'QUPassword123!';
const demoUsers = [
  'test1001@qu.edu.sa',
  'test2001@qu.edu.sa'
];

async function check() {
  for (const email of demoUsers) {
    console.log(`Checking demo user login for: ${email}`);
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInErr) {
      console.log(`Sign in failed for ${email}: ${signInErr.message}`);
      if (signInErr.message.includes('Invalid login credentials') || signInErr.message.includes('User not found')) {
        console.log(`Attempting to sign up ${email}...`);
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email,
          password
        });
        if (signUpErr) {
          console.log(`Sign up failed for ${email}: ${signUpErr.message}`);
        } else {
          console.log(`Sign up success for ${email}! User ID: ${signUpData.user?.id}`);
        }
      }
    } else {
      console.log(`Sign in SUCCESS for ${email}! User ID: ${signInData.user?.id}`);
    }
  }
}

check();
