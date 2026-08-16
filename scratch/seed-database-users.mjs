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
const mockUsers = [
  { email: 'student1@qu.edu.sa', studentId: '422102998', firstName: 'عبدالرحمن', gender: 'male', collegeId: 1, majorId: 1, level: 5, bio: 'طالب علوم حاسب مستوى خامس، أهتم بالخوارزميات وحل المشكلات التنافسية.', avatar: '👨‍💻', interests: [1, 2, 6, 17], goals: [1, 3] },
  { email: 'student2@qu.edu.sa', studentId: '423101235', firstName: 'خالد', gender: 'male', collegeId: 2, majorId: 5, level: 6, bio: 'مهتم بالأنشطة الطلابية وتصميم الجرافيك. أحب النقاشات الهادفة والعمل الجماعي التطوعي.', avatar: '👷‍♂️', interests: [20, 14, 9, 17], goals: [2, 4] },
  { email: 'student3@qu.edu.sa', studentId: '420108743', firstName: 'ريم', gender: 'female', collegeId: 2, majorId: 5, level: 4, bio: 'مهندسة برمجيات في السنة الرابعة. أحب المشاركة في الهاكاثونات وتطوير المشاريع التقنية واللعب بالبادل.', avatar: '👩‍🔬', interests: [2, 18, 19, 11], goals: [4, 1] },
  { email: 'student4@qu.edu.sa', studentId: '421102999', firstName: 'نورة', gender: 'female', collegeId: 1, majorId: 3, level: 3, bio: 'طالبة تقنية معلومات مهتمة بالتطوير وتصميم التطبيقات والأنشطة الإبداعية.', avatar: '👩‍💻', interests: [1, 2, 4, 15], goals: [1, 2] }
];

async function seed() {
  for (const item of mockUsers) {
    console.log(`Checking/Registering user: ${item.email}`);
    let userId = '';

    // Try signing in to get ID
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
      email: item.email,
      password
    });

    if (signInErr) {
      // Try to register
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: item.email,
        password
      });
      if (signUpErr) {
        console.error(`Sign up failed for ${item.email}:`, signUpErr.message);
        continue;
      }
      userId = signUpData.user?.id || '';
      console.log(`Registered new user ${item.email} with ID: ${userId}`);
    } else {
      userId = signInData.user?.id || '';
      console.log(`User ${item.email} already exists. ID: ${userId}`);
    }

    if (!userId) continue;

    // Insert/upsert profile
    console.log(`Upserting profile for ${item.firstName}...`);
    const { error: profErr } = await supabase.from('profiles').upsert({
      id: userId,
      student_id: item.studentId,
      first_name: item.firstName,
      college_id: item.collegeId,
      major_id: item.majorId,
      academic_level: item.level,
      bio: item.bio,
      avatar_url: item.avatar,
      gender_group: item.gender
    });

    if (profErr) {
      console.error(`Failed to upsert profile for ${item.firstName}:`, profErr.message);
      continue;
    }

    // Seed interests
    console.log(`Seeding interests for ${item.firstName}...`);
    await supabase.from('user_interests').delete().eq('user_id', userId);
    const intRows = item.interests.map(id => ({
      user_id: userId,
      interest_id: id,
      importance: 0
    }));
    const { error: intErr } = await supabase.from('user_interests').insert(intRows);
    if (intErr) console.error(`Failed to seed interests:`, intErr.message);

    // Seed goals
    console.log(`Seeding goals for ${item.firstName}...`);
    await supabase.from('user_goals').delete().eq('user_id', userId);
    const goalRows = item.goals.map(id => ({
      user_id: userId,
      goal_id: id
    }));
    const { error: goalErr } = await supabase.from('user_goals').insert(goalRows);
    if (goalErr) console.error(`Failed to seed goals:`, goalErr.message);

    console.log(`Completed seeding for ${item.firstName}!`);
  }
}

seed();
