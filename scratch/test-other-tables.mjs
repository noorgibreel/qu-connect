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
const email = '421105991@qu.edu.sa';

async function run() {
  console.log('Signing in user:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    console.error('Sign in error:', error.message);
    return;
  }

  const userId = data.user?.id;
  console.log('SUCCESS! User ID:', userId);

  // 1. Try to insert into user_goals
  console.log('Testing insert into user_goals...');
  const { data: gData, error: gErr } = await supabase.from('user_goals').insert({
    user_id: userId,
    goal_id: 1 // Attempt goal ID 1
  }).select();
  if (gErr) {
    console.log('user_goals error:', gErr.message);
  } else {
    console.log('user_goals success:', gData);
    await supabase.from('user_goals').delete().eq('user_id', userId);
  }

  // 2. Try to insert into user_interests
  console.log('Testing insert into user_interests...');
  const { data: iData, error: iErr } = await supabase.from('user_interests').insert({
    user_id: userId,
    interest_id: 1, // Attempt interest ID 1
    importance: 1
  }).select();
  if (iErr) {
    console.log('user_interests error:', iErr.message);
  } else {
    console.log('user_interests success:', iData);
    await supabase.from('user_interests').delete().eq('user_id', userId);
  }

  // 3. Try to insert into social_preferences
  console.log('Testing insert into social_preferences...');
  const { data: sData, error: sErr } = await supabase.from('social_preferences').insert({
    user_id: userId,
    communication_type: 'محادثات نصية',
    personality_preference: 'طموح'
  }).select();
  if (sErr) {
    console.log('social_preferences error:', sErr.message);
  } else {
    console.log('social_preferences success:', sData);
    await supabase.from('social_preferences').delete().eq('user_id', userId);
  }
}

run();
