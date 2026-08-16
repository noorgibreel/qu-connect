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

async function inspect() {
  // Test colleges columns
  console.log('Testing insert into colleges...');
  const { data: cData, error: cErr } = await supabase.from('colleges').insert({ id: 100, name_ar: 'اختبار' }).select();
  if (cErr) {
    console.log('Colleges error:', cErr.message, cErr.details);
  } else {
    console.log('Colleges success, inserted:', cData);
    // Cleanup
    await supabase.from('colleges').delete().eq('id', 100);
  }

  // Test majors columns
  console.log('Testing insert into majors...');
  const { data: mData, error: mErr } = await supabase.from('majors').insert({ id: 100, college_id: 100, name_ar: 'تخصص اختبار' }).select();
  if (mErr) {
    console.log('Majors error:', mErr.message, mErr.details);
  } else {
    console.log('Majors success, inserted:', mData);
    await supabase.from('majors').delete().eq('id', 100);
  }

  // Test interests columns
  console.log('Testing insert into interests...');
  const { data: iData, error: iErr } = await supabase.from('interests').insert({ id: 100, name_ar: 'اهتمام اختبار', category: 'Technology' }).select();
  if (iErr) {
    console.log('Interests error:', iErr.message, iErr.details);
  } else {
    console.log('Interests success, inserted:', iData);
    await supabase.from('interests').delete().eq('id', 100);
  }

  // Test goals columns
  console.log('Testing insert into goals...');
  const { data: gData, error: gErr } = await supabase.from('goals').insert({ id: 99, name_ar: 'هدف اختبار' }).select();
  if (gErr) {
    console.log('Goals error:', gErr.message, gErr.details);
  } else {
    console.log('Goals success, inserted:', gData);
    await supabase.from('goals').delete().eq('id', 99);
  }
}

inspect();
