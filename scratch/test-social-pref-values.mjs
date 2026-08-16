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

const candidateValues = [
  // Text Chat
  'text', 'chat', 'text_chat', 'messages', 'sms', 'text_only',
  // Study Meetings
  'study', 'in_person', 'meetings', 'study_sessions', 'face_to_face',
  // Group Events
  'group', 'events', 'group_events', 'activities',
  // Arabic values again (just in case)
  'محادثات نصية', 'لقاءات دراسية', 'فعاليات جماعية'
];

async function run() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    console.error('Sign in error:', error.message);
    return;
  }
  const userId = data.user?.id;

  console.log('Testing values for communication_type check constraint...');
  for (const val of candidateValues) {
    const { error: insErr } = await supabase.from('social_preferences').insert({
      user_id: userId,
      communication_type: val,
      personality_preference: 'طموح'
    });
    if (insErr) {
      if (insErr.message.includes('check constraint')) {
        // Failed check constraint
      } else {
        console.log(`Value "${val}" failed with other error:`, insErr.message);
      }
    } else {
      console.log(`SUCCESS! Value "${val}" is accepted!`);
      // Clean up
      await supabase.from('social_preferences').delete().eq('user_id', userId);
    }
  }
}

run();
