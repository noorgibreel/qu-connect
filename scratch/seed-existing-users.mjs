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
const password = 'QUPassword123!';

const usersToSeed = [
  {
    email: 'test1001@qu.edu.sa',
    studentId: 'test1001',
    firstName: 'خالد',
    gender: 'male',
    collegeId: 1, // كلية الحاسب
    majorId: 1, // علوم الحاسب
    level: 6,
    bio: 'طالب علوم حاسب مهتم بالبرمجة والذكاء الاصطناعي وبطولات الألعاب.',
    avatar: '👨‍💻',
    interests: [1, 2, 6, 17, 11], // AI, Programming, Games, Volunteering, Padel
    goals: [1, 2] // Study Partner, New Friends
  },
  {
    email: 'student1@qu.edu.sa',
    studentId: 'test1002',
    firstName: 'عبدالرحمن',
    gender: 'male',
    collegeId: 1, // كلية الحاسب
    majorId: 1, // علوم الحاسب
    level: 5,
    bio: 'طالب علوم حاسب مستوى خامس، أهتم بالخوارزميات وحل المشكلات التنافسية.',
    avatar: '👨‍💻',
    interests: [1, 2, 6, 17], // AI, Programming, Games, Volunteering
    goals: [1, 3] // Study Partner, Guidance
  },
  {
    email: 'test2001@qu.edu.sa',
    studentId: 'test2001',
    firstName: 'سارة',
    gender: 'female',
    collegeId: 1, // كلية الحاسب
    majorId: 3, // تقنية المعلومات
    level: 4,
    bio: 'طالبة تقنية معلومات مهتمة بتصميم الواجهات والأنشطة الطلابية والإبداع.',
    avatar: '👩‍💻',
    interests: [4, 2, 15, 17, 7], // UI Design, Programming, Drawing, Volunteering, Movies
    goals: [1, 4] // Study Partner, Activities
  },
  {
    email: '421105991@qu.edu.sa',
    studentId: '421105991',
    firstName: 'نورة',
    gender: 'female',
    collegeId: 1, // كلية الحاسب
    majorId: 3, // تقنية المعلومات
    level: 3,
    bio: 'طالبة تقنية معلومات مهتمة بالتطوير وتصميم التطبيقات والأنشطة الإبداعية.',
    avatar: '👩‍💻',
    interests: [1, 2, 4, 15], // AI, Programming, UI Design, Drawing
    goals: [1, 2] // Study Partner, New Friends
  }
];

async function seed() {
  for (const item of usersToSeed) {
    console.log(`\nLogging in as ${item.email}...`);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: item.email,
      password
    });

    if (authErr) {
      console.error(`Login failed for ${item.email}:`, authErr.message);
      continue;
    }

    const userId = authData.user.id;
    console.log(`Success! User ID: ${userId}`);

    // 1. Profile
    console.log(`Upserting profile...`);
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
      console.error(`Failed to upsert profile:`, profErr.message);
      continue;
    }

    // 2. Interests
    console.log(`Seeding interests...`);
    await supabase.from('user_interests').delete().eq('user_id', userId);
    const intRows = item.interests.map(id => ({
      user_id: userId,
      interest_id: id,
      importance: 0
    }));
    const { error: intErr } = await supabase.from('user_interests').insert(intRows);
    if (intErr) console.error(`Failed to seed interests:`, intErr.message);

    // 3. Goals
    console.log(`Seeding goals...`);
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
