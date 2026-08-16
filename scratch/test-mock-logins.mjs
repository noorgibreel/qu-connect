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
const emails = [
  '421105991@qu.edu.sa',
  '420108743@qu.edu.sa',
  '422102998@qu.edu.sa',
  '423101235@qu.edu.sa'
];

async function run() {
  for (const email of emails) {
    console.log('Trying to sign in with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      console.log(`Failed for ${email}:`, error.message);
    } else {
      console.log(`SUCCESS for ${email}! User ID:`, data.user?.id);
      
      // Let's try to select a profile for this user
      const userId = data.user?.id;
      console.log('Selecting profile for User ID:', userId);
      const { data: profSel, error: selErr } = await supabase.from('profiles').select('*').eq('id', userId);
      if (selErr) {
        console.log('Select profile error:', selErr.message);
      } else {
        console.log('Select profile result:', profSel);
      }
      
      // Let's try to insert a profile for this user
      console.log('Attempting insert into profiles for User ID:', userId);
      const randomStudentId = Math.floor(100000000 + Math.random() * 900000000).toString();
      console.log('Using student_id:', randomStudentId);
      const { data: profData, error: profErr } = await supabase.from('profiles').insert({
        id: userId,
        first_name: 'أحمد',
        academic_level: 6,
        student_id: randomStudentId
      }).select();
      
      if (profErr) {
        console.log('Profiles insert error:', profErr.message, profErr.details);
      } else {
        console.log('Profiles insert success! Inserted:', profData);
        // Clean up
        await supabase.from('profiles').delete().eq('id', userId);
      }
    }
  }
}

run();
