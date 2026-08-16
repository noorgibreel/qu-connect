"use client";

import React, { useState, useEffect } from "react";
import MobileFrame from "./MobileFrame";
import { Student } from "../data/mockData";
import { supabase } from "../lib/supabaseClient";
import { translations, Language } from "../lib/translations";
import {
  Splash,
  Welcome,
  LanguageSelector,
  Login,
  ProfileSetup,
  Interests,
  InterestImportance,
  Goals
} from "./screens/OnboardingScreens";
import {
  HomeTab,
  MatchingTab,
  SuggestedStudents,
  StudentProfileDetail,
  ConnectionsTab,
  ChatScreen,
  NotificationsScreen,
  SettingsTab,
  MatchSuccessModal
} from "./screens/AppScreens";

export default function AppShell() {
  const [currentScreen, setScreen] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'home' | 'matches' | 'connections' | 'profile' | 'notifications'>('home');
  
  // Profile settings
  const [user, setUser] = useState<Student>({
    id: "me",
    studentId: "",
    displayName: "",
    gender: "male", // default, will toggle theme class
    college: "",
    major: "",
    level: 6, // default
    interests: [],
    goals: [],
    personality: [],
    communicationPref: "محادثات نصية",
    bio: "",
    avatar: "🎓"
  });

  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("qu_connect_language");
      if (saved === "en" || saved === "ar") return saved;
    }
    return "ar";
  });

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("qu_connect_language", lang);
      } catch (e) {}
    }
  };

  const t = (key: string, replacements?: Record<string, string | number>) => {
    const dict = translations[language] || translations['ar'];
    let text = (dict as any)[key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const updateUser = (fields: Partial<Student>) => {
    setUser(prev => {
      const updated = {
        ...prev,
        ...fields
      };
      if (typeof window !== "undefined" && updated.id && updated.id !== "me") {
        try {
          localStorage.setItem(`qu_connect_profile_${updated.id}`, JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save profile to localStorage:", e);
        }
      }
      return updated;
    });
  };

  // State elements
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [chatThreads, setChatThreads] = useState<Record<string, { sender: 'me' | 'them'; text: string; time: string }[]>>({});
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; read: boolean }[]>([
    {
      id: "init_1",
      text: "مرحباً بك في تطبيق QU Connect! أكمل ملفك الشخصي للاتصال بزملائك.",
      time: "منذ ساعة",
      read: false
    }
  ]);
  
  const [viewedStudent, setViewedStudent] = useState<Student | null>(null);
  const [activeChatStudent, setActiveChatStudent] = useState<Student | null>(null);
  const [matchedStudentForModal, setMatchedStudentForModal] = useState<Student | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [matches, setMatches] = useState<Student[]>([]);
  const [connections, setConnections] = useState<any[]>([]);

  // Supabase states
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  const [dbColleges, setDbColleges] = useState<any[]>([]);
  const [dbMajors, setDbMajors] = useState<any[]>([]);
  const [dbInterests, setDbInterests] = useState<any[]>([]);
  const [dbGoals, setDbGoals] = useState<any[]>([]);

  // Function to load all user metadata and profile dynamically
  const loadAllData = async (userId: string) => {
    if (userId.startsWith('demo-')) {
      let localProfile: Student | null = null;
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(`qu_connect_profile_${userId}`);
          if (saved) {
            localProfile = JSON.parse(saved);
          }
        } catch (e) {}
      }

      if (localProfile) {
        setUser(localProfile);
        const isComplete = (localProfile.interests || []).length > 0 && (localProfile.goals || []).length > 0;
        setScreen(isComplete ? 10 : 4);
      } else {
        const isMale = !userId.includes("female");
        const cleanId = userId.replace('demo-', '');
        const defaultDemo: Student = {
          id: userId,
          studentId: cleanId,
          displayName: "",
          gender: isMale ? "male" : "female",
          college: "",
          major: "",
          level: 6,
          interests: [],
          goals: [],
          personality: [],
          communicationPref: "",
          bio: "",
          avatar: isMale ? "👨‍💻" : "👩‍💻"
        };
        setUser(defaultDemo);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`qu_connect_profile_${userId}`, JSON.stringify(defaultDemo));
          } catch (e) {}
        }
        setScreen(4); // Go to step 1 onboarding
      }
      return;
    }

    try {
      const { data: cols } = await supabase.from('colleges').select('*');
      const { data: majs } = await supabase.from('majors').select('*');
      const { data: ints } = await supabase.from('interests').select('*');
      const { data: gls } = await supabase.from('goals').select('*');

      setDbColleges(cols || []);
      setDbMajors(majs || []);
      setDbInterests(ints || []);
      setDbGoals(gls || []);

      const { data: { user: authUser } } = await supabase.auth.getUser();
      const email = authUser?.email || "";

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      
      if (profile) {
        const colName = cols?.find(c => c.id === profile.college_id)?.name_ar || "";
        const majName = majs?.find(m => m.id === profile.major_id)?.name_ar || "";

        const { data: userInts } = await supabase.from('user_interests').select('interest_id').eq('user_id', userId);
        const interestNames = (userInts || []).map(ui => ints?.find(i => i.id === ui.interest_id)?.name_ar).filter(Boolean) as string[];

        const { data: userGls } = await supabase.from('user_goals').select('goal_id').eq('user_id', userId);
        const goalNames = (userGls || []).map(ug => gls?.find(g => g.id === ug.goal_id)?.name_ar).filter(Boolean) as string[];

        const { data: socialPref } = await supabase.from('social_preferences').select('*').eq('user_id', userId).single();

        const commPrefMap: Record<string, string> = {
          'chat': 'محادثات نصية',
          'study': 'لقاءات دراسية',
          'group': 'فعاليات جماعية',
          'activities': 'فعاليات جماعية'
        };
        const dbCommPref = socialPref?.communication_type || "";
        const commPref = commPrefMap[dbCommPref] || dbCommPref || "محادثات نصية";

        const loadedUser: Student = {
          id: userId,
          studentId: profile.student_id || "",
          displayName: profile.first_name || "",
          gender: (profile.gender_group as any) || "male",
          college: colName,
          major: majName,
          level: profile.academic_level || 6,
          interests: interestNames,
          goals: goalNames,
          personality: socialPref ? (socialPref.personality_preference || "").split(',').filter(Boolean) : [],
          communicationPref: commPref,
          bio: profile.bio || "",
          avatar: profile.avatar_url || "🎓"
        };

        setUser(loadedUser);

        if (typeof window !== "undefined") {
          localStorage.setItem(`qu_connect_profile_${userId}`, JSON.stringify(loadedUser));
        }
        
        setScreen(userId.startsWith('demo-') ? 4 : 10); // Navigate to onboarding for demo, else dashboard
      } else {
        // Fallback to localStorage check
        let localProfile = null;
        if (typeof window !== "undefined") {
          try {
            const saved = localStorage.getItem(`qu_connect_profile_${userId}`);
            if (saved) {
              localProfile = JSON.parse(saved);
            }
          } catch (e) {
            console.error("Failed to read profile from localStorage:", e);
          }
        }

        if (localProfile) {
          setUser(localProfile);
          setScreen(userId.startsWith('demo-') ? 4 : 10); // Navigate to onboarding for demo, else dashboard
        } else if (email === 'test1001@qu.edu.sa' || email === 'test2001@qu.edu.sa') {
          // Auto-initialize demo account profile if not found in db or localStorage
          const isMale = email === 'test1001@qu.edu.sa';
          const demoUser: Student = {
            id: userId,
            studentId: isMale ? 'test1001' : 'test2001',
            displayName: isMale ? 'خالد' : 'سارة',
            gender: isMale ? 'male' : 'female',
            college: 'كلية الحاسب',
            major: isMale ? 'علوم الحاسب' : 'تقنية المعلومات',
            level: isMale ? 6 : 4,
            interests: isMale 
              ? ['الذكاء الاصطناعي', 'برمجة وتطوير', 'أمن سيبراني', 'بادل', 'ألعاب الفيديو']
              : ['تصميم واجهات', 'برمجة وتطوير', 'الرسم', 'التطوع', 'أفلام ومسلسلات'],
            goals: isMale ? ['شريك مذاكرة', 'أصدقاء جدد'] : ['شريك مذاكرة', 'أنشطة وفعاليات'],
            personality: isMale ? ['طموح', 'متعاون'] : ['مبدع', 'متعاون'],
            communicationPref: isMale ? 'محادثات نصية' : 'لقاءات دراسية',
            bio: isMale 
              ? 'طالب علوم حاسب مهتم بالبرمجة والذكاء الاصطناعي.'
              : 'طالبة تقنية معلومات مهتمة بتصميم الواجهات والأنشطة الطلابية.',
            avatar: isMale ? '👨‍💻' : '👩‍💻'
          };

          setUser(demoUser);

          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`qu_connect_profile_${userId}`, JSON.stringify(demoUser));
            } catch (e) {
              console.error("Failed to save demo profile to localStorage:", e);
            }
          }

          setScreen(userId.startsWith('demo-') ? 4 : 10); // Navigate to onboarding for demo, else dashboard
        } else {
          // Pre-fill user ID and wait for onboarding setup
          setUser(prev => ({
            ...prev,
            id: userId
          }));
          setScreen(4); // Navigate to step 1 onboarding
        }
      }
    } catch (e) {
      console.error("Error loading user profile details from Supabase, falling back to local:", e);
      let localProfile = null;
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(`qu_connect_profile_${userId}`);
          if (saved) {
            localProfile = JSON.parse(saved);
          }
        } catch (err) {}
      }

      if (localProfile) {
        setUser(localProfile);
        setScreen(userId.startsWith('demo-') ? 4 : 10);
      } else {
        setUser(prev => ({
          ...prev,
          id: userId
        }));
        setScreen(4); // Navigate to step 1 onboarding
      }
    }
  };

  const fetchMatches = async (userId: string, currentUser: Student) => {
    if (!userId || userId === "me") return;
    try {
      const isDemo = userId.startsWith('demo-');
      const MOCK_STUDENTS = [
        {
          id: '3',
          studentId: '422102998',
          displayName: 'عبدالرحمن خالد',
          gender: 'male',
          college: 'كلية الحاسب',
          major: 'علوم الحاسب',
          level: 5,
          interests: ['الذكاء الاصطناعي', 'برمجة وتطوير', 'ألعاب الفيديو', 'التطوع'],
          goals: ['شريك مذاكرة', 'توجيه وإرشاد'],
          personality: ['تحليلي', 'هادئ', 'متعاون'],
          communicationPref: 'محادثات نصية',
          bio: 'طالب علوم حاسب مستوى خامس، أهتم بالخوارزميات وحل المشكلات التنافسية.',
          avatar: '👨‍💻'
        },
        {
          id: '4',
          studentId: '423101235',
          displayName: 'خالد العنزي',
          gender: 'male',
          college: 'كلية الهندسة',
          major: 'هندسة كهربائية',
          level: 6,
          interests: ['النقاشات العامة', 'التصميم الجرافيكي', 'كرة القدم', 'التطوع'],
          goals: ['أصدقاء جدد', 'أنشطة وفعاليات'],
          personality: ['اجتماعي', 'مبدع', 'طموح'],
          communicationPref: 'فعاليات جماعية',
          bio: 'مهتم بالأنشطة الطلابية وتصميم الجرافيك. أحب النقاشات الهادفة والعمل الجماعي التطوعي.',
          avatar: '👷‍♂️'
        },
        {
          id: '7',
          studentId: '422109843',
          displayName: 'أحمد المطيري',
          gender: 'male',
          college: 'كلية الحاسب',
          major: 'علوم الحاسب',
          level: 7,
          interests: ['الذكاء الاصطناعي', 'برمجة وتطوير', 'أمن سيبراني', 'ألعاب الفيديو'],
          goals: ['شريك مذاكرة', 'توجيه وإرشاد'],
          personality: ['طموح', 'متعاون'],
          communicationPref: 'محادثات نصية',
          bio: 'أدرس علوم حاسب، مهتم بالحلول الذكية وتطوير خوارزميات التعلم الآلي.',
          avatar: '👨‍🔬'
        },
        {
          id: '8',
          studentId: '423109312',
          displayName: 'فيصل الحربي',
          gender: 'male',
          college: 'كلية إدارة الأعمال',
          major: 'تسويق',
          level: 5,
          interests: ['ريادة الأعمال', 'التطوع', 'بادل', 'أفلام ومسلسلات'],
          goals: ['أصدقاء جدد', 'أنشطة وفعاليات'],
          personality: ['اجتماعي', 'مبدع'],
          communicationPref: 'فعاليات جماعية',
          bio: 'طالب إدارة أعمال مهتم بالتسويق الرقمي وبناء العلاقات العامة والأنشطة الرياضية كالبادل.',
          avatar: '👨‍💼'
        },
        {
          id: '2',
          studentId: '420108743',
          displayName: 'ريم',
          gender: 'female',
          college: 'كلية الهندسة',
          major: 'هندسة كهربائية',
          level: 4,
          interests: ['برمجة وتطوير', 'ريادة الأعمال', 'الأندية الطلابية', 'بادل'],
          goals: ['أنشطة وفعاليات', 'شريك مذاكرة'],
          personality: ['اجتماعي', 'طموح', 'متعاون'],
          communicationPref: 'لقاءات دراسية',
          bio: 'مهندسة برمجيات في السنة الرابعة. أحب المشاركة في الهاكاثونات وتطوير المشاريع التقنية واللعب بالبادل.',
          avatar: '👩‍🔬'
        },
        {
          id: '1',
          studentId: '421102999',
          displayName: 'سارة',
          gender: 'female',
          college: 'كلية الحاسب',
          major: 'تقنية المعلومات',
          level: 3,
          interests: ['الذكاء الاصطناعي', 'برمجة وتطوير', 'تصميم واجهات', 'الرسم'],
          goals: ['شريك مذاكرة', 'أصدقاء جدد'],
          personality: ['طموح', 'مبدع', 'متعاون'],
          communicationPref: 'محادثات نصية',
          bio: 'طالبة علوم حاسب سنة ثالثة، مهتمة بمجال الذكاء الاصطناعي وتصميم واجهات المستخدم (UI/UX).',
          avatar: '👩‍💻'
        },
        {
          id: '5',
          studentId: '422108742',
          displayName: 'نورة العتيبي',
          gender: 'female',
          college: 'كلية الحاسب',
          major: 'علوم الحاسب',
          level: 5,
          interests: ['الذكاء الاصطناعي', 'برمجة وتطوير', 'تصميم واجهات', 'التطوع'],
          goals: ['شريك مذاكرة', 'أصدقاء جدد'],
          personality: ['تحليلي', 'هادئ', 'متعاون'],
          communicationPref: 'محادثات نصية',
          bio: 'أهتم بحل المشكلات وتطوير الويب، أبحث عن شريكة مذاكرة نشيطة لمراجعة المواد الدراسية.',
          avatar: '👩‍💻'
        },
        {
          id: '6',
          studentId: '423102391',
          displayName: 'هدى العلي',
          gender: 'female',
          college: 'كلية العلوم',
          major: 'رياضيات',
          level: 6,
          interests: ['النقاشات العامة', 'الرسم', 'كرة السلة', 'التطوع'],
          goals: ['أصدقاء جدد', 'أنشطة وفعاليات'],
          personality: ['اجتماعي', 'مبدع', 'طموح'],
          communicationPref: 'فعاليات جماعية',
          bio: 'طالبة رياضيات أهتم بالرسم وتنسيق الفعاليات الرياضية، أحب العمل التطوعي.',
          avatar: '👩‍💼'
        }
      ];

      if (isDemo) {
        // Direct local calculations for mock candidates to prevent database queries hanging
        const mockCandidates = MOCK_STUDENTS.filter(s => s.id !== userId && s.studentId !== currentUser.studentId && s.gender === currentUser.gender);
        
        const scoredMatches = mockCandidates.map(s => {
          const userInts = currentUser.interests || [];
          const userGls = currentUser.goals || [];
          const sharedInts = s.interests.filter(i => userInts.includes(i));
          const interestScore = (sharedInts.length / Math.max(userInts.length, 1)) * 60;

          const sharedGls = s.goals.filter(g => userGls.includes(g));
          const goalScore = (sharedGls.length / Math.max(userGls.length, 1)) * 20;

          const collegeMatch = s.college === currentUser.college ? 10 : 0;
          const majorMatch = s.major === currentUser.major ? 10 : 0;

          const compatibility = Math.min(100, Math.round(interestScore + goalScore + collegeMatch + majorMatch));

          let explanation = "";
          if (sharedInts.length > 0) {
            explanation = `لديكما ${sharedInts.length} اهتمامات مشتركة`;
            if (sharedGls.length > 0) {
              explanation += `، وهدفكما هو ${sharedGls.join(' و ')}.`;
            } else {
              explanation += `.`;
            }
          } else if (sharedGls.length > 0) {
            explanation = `هدفكما المشترك هو ${sharedGls.join(' و ')}.`;
          } else {
            explanation = `تدرسان في نفس الكلية/القسم وتتشاركان الاهتمامات الأكاديمية.`;
          }

          return {
            ...s,
            compatibility,
            sparkleText: explanation,
            personality: s.personality || [],
            communicationPref: s.communicationPref || "محادثات نصية",
            gender: s.gender as "male" | "female"
          };
        });

        const sorted = scoredMatches
          .sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0))
          .slice(0, 10);
        setMatches(sorted);

        // Populate local connections from localStorage for demo users
        let loadedConns: any[] = [];
        if (typeof window !== "undefined") {
          try {
            const saved = localStorage.getItem(`qu_connect_connections_${userId}`);
            if (saved) {
              loadedConns = JSON.parse(saved);
            } else {
              const isMale = currentUser.gender === 'male';
              const demoSeed = [
                {
                  id: 'demo-seed-request',
                  requester_id: isMale ? '3' : '2',
                  recipient_id: userId,
                  status: 'pending',
                  created_at: new Date().toISOString()
                }
              ];
              localStorage.setItem(`qu_connect_connections_${userId}`, JSON.stringify(demoSeed));
              loadedConns = demoSeed;
            }
          } catch (e) {
            console.error("Local connections load failed:", e);
          }
        }
        setConnections(loadedConns);
        return;
      }

      let cols = dbColleges;
      let majs = dbMajors;
      let ints = dbInterests;
      let gls = dbGoals;
      
      if (cols.length === 0) {
        const { data } = await supabase.from('colleges').select('*');
        if (data) setDbColleges(data);
        cols = data || [];
      }
      if (majs.length === 0) {
        const { data } = await supabase.from('majors').select('*');
        if (data) setDbMajors(data);
        majs = data || [];
      }
      if (ints.length === 0) {
        const { data } = await supabase.from('interests').select('*');
        if (data) setDbInterests(data);
        ints = data || [];
      }
      if (gls.length === 0) {
        const { data } = await supabase.from('goals').select('*');
        if (data) setDbGoals(data);
        gls = data || [];
      }

      let loadedConns: any[] = [];
      
      if (!isDemo) {
        try {
          const { data, error } = await supabase
            .from('connections')
            .select('*')
            .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
          if (!error && data) {
            loadedConns = data;
          }
        } catch (e) {
          console.error("DB connections fetch failed:", e);
        }
      }

      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(`qu_connect_connections_${userId}`);
          if (saved) {
            const localConns = JSON.parse(saved);
            if (isDemo || loadedConns.length === 0) {
              loadedConns = localConns;
            }
          } else {
            if (isDemo) {
              const isMale = currentUser.gender === 'male';
              const demoSeed = [
                {
                  id: 'demo-seed-request',
                  requester_id: isMale ? '3' : '2',
                  recipient_id: userId,
                  status: 'pending',
                  created_at: new Date().toISOString()
                }
              ];
              localStorage.setItem(`qu_connect_connections_${userId}`, JSON.stringify(demoSeed));
              loadedConns = demoSeed;
            }
          }
        } catch (e) {
          console.error("Failed to read connections from localStorage:", e);
        }
      }
      setConnections(loadedConns);

      let candidates: any[] = [];
      if (!isDemo) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('gender_group', currentUser.gender)
            .neq('id', userId);
          if (!error && data && data.length > 0) {
            candidates = data;
          }
        } catch (e) {}
      }


      if (candidates.length === 0) {
        const mockCandidates = MOCK_STUDENTS.filter(s => s.id !== userId && s.studentId !== currentUser.studentId && s.gender === currentUser.gender);
        
        const scoredMatches = mockCandidates.map(s => {
          const sharedInts = s.interests.filter(i => currentUser.interests.includes(i));
          const interestScore = (sharedInts.length / Math.max(currentUser.interests.length, 1)) * 60;

          const sharedGls = s.goals.filter(g => currentUser.goals.includes(g));
          const goalScore = (sharedGls.length / Math.max(currentUser.goals.length, 1)) * 20;

          const collegeMatch = s.college === currentUser.college ? 10 : 0;
          const majorMatch = s.major === currentUser.major ? 10 : 0;

          const compatibility = Math.min(100, Math.round(interestScore + goalScore + collegeMatch + majorMatch));

          let explanation = "";
          if (sharedInts.length > 0) {
            explanation = `لديكما ${sharedInts.length} اهتمامات مشتركة`;
            if (sharedGls.length > 0) {
              explanation += `، وهدفكما هو ${sharedGls.join(' و ')}.`;
            } else {
              explanation += `.`;
            }
          } else if (sharedGls.length > 0) {
            explanation = `هدفكما المشترك هو ${sharedGls.join(' و ')}.`;
          } else {
            explanation = `تدرسان في نفس الكلية/القسم وتتشاركان الاهتمامات الأكاديمية.`;
          }

          return {
            ...s,
            compatibility,
            sparkleText: explanation,
            personality: s.personality || [],
            communicationPref: s.communicationPref || "محادثات نصية",
            gender: s.gender as "male" | "female"
          };
        });

        const sorted = scoredMatches
          .sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0))
          .slice(0, 10);
        setMatches(sorted);
        return;
      }

      const profileIds = candidates.map(p => p.id);
      const { data: allInterests } = await supabase
        .from('user_interests')
        .select('*')
        .in('user_id', profileIds);

      const { data: allGoals } = await supabase
        .from('user_goals')
        .select('*')
        .in('user_id', profileIds);

      const calculatedMatches = candidates.map(p => {
        const colName = cols.find(c => c.id === p.college_id)?.name_ar || "";
        const majName = majs.find(m => m.id === p.major_id)?.name_ar || "";

        const candidateIntIds = (allInterests || []).filter(ui => ui.user_id === p.id).map(ui => ui.interest_id);
        const candidateIntNames = candidateIntIds.map(id => ints.find(i => i.id === id)?.name_ar).filter(Boolean) as string[];

        const candidateGoalIds = (allGoals || []).filter(ug => ug.user_id === p.id).map(ug => ug.goal_id);
        const candidateGoalNames = candidateGoalIds.map(id => gls.find(g => g.id === id)?.name_ar).filter(Boolean) as string[];

        const sharedInts = candidateIntNames.filter(i => currentUser.interests.includes(i));
        const interestScore = (sharedInts.length / Math.max(currentUser.interests.length, 1)) * 60;

        const sharedGls = candidateGoalNames.filter(g => currentUser.goals.includes(g));
        const goalScore = (sharedGls.length / Math.max(currentUser.goals.length, 1)) * 20;

        const collegeMatch = colName === currentUser.college ? 10 : 0;
        const majorMatch = majName === currentUser.major ? 10 : 0;

        const compatibility = Math.min(100, Math.round(interestScore + goalScore + collegeMatch + majorMatch));

        let explanation = "";
        if (sharedInts.length > 0) {
          explanation = `لديكما ${sharedInts.length} اهتمامات مشتركة`;
          if (sharedGls.length > 0) {
            explanation += `، وهدفكما هو ${sharedGls.join(' و ')}.`;
          } else {
            explanation += `.`;
          }
        } else if (sharedGls.length > 0) {
          explanation = `هدفكما المشترك هو ${sharedGls.join(' و ')}.`;
        } else {
          explanation = `تدرسان في نفس الكلية/القسم وتتشاركان الاهتمامات الأكاديمية.`;
        }

        return {
          id: p.id,
          studentId: p.student_id || "",
          displayName: p.first_name || "",
          gender: (p.gender_group as any) || "male",
          college: colName,
          major: majName,
          level: p.academic_level || 6,
          interests: candidateIntNames,
          goals: candidateGoalNames,
          personality: [],
          communicationPref: "محادثات نصية",
          bio: p.bio || "",
          avatar: p.avatar_url || "🎓",
          compatibility,
          sparkleText: explanation
        };
      });

      const sorted = calculatedMatches
        .sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0))
        .slice(0, 10);

      setMatches(sorted);
    } catch (e) {
      console.error("Exception loading matching scores:", e);
    }
  };

  const sendConnectionRequest = async (recipientId: string) => {
    const userId = user.id;
    if (userId === "me" || userId === recipientId) return;

    // Security boundary: same gender only
    const recipientUser = matches.find(m => m.id === recipientId) || MOCK_STUDENTS_FALLBACK.find(s => s.id === recipientId);
    if (!recipientUser || recipientUser.gender !== user.gender) {
      console.error("Security violation: cannot request connection to opposite gender.");
      return;
    }

    const isDemo = userId.startsWith('demo-');
    let success = false;

    if (!isDemo) {
      try {
        const { error } = await supabase.from('connections').insert({
          requester_id: userId,
          recipient_id: recipientId,
          status: 'pending'
        });
        if (!error) success = true;
      } catch (e) {
        console.error("DB connection insert failed:", e);
      }
    }

    if (isDemo || !success) {
      try {
        const saved = localStorage.getItem(`qu_connect_connections_${userId}`);
        const localConns = saved ? JSON.parse(saved) : [];
        if (!localConns.some((c: any) => c.requester_id === userId && c.recipient_id === recipientId)) {
          const newConn = {
            id: `local-conn-${Date.now()}`,
            requester_id: userId,
            recipient_id: recipientId,
            status: 'pending',
            created_at: new Date().toISOString()
          };
          localConns.push(newConn);
          localStorage.setItem(`qu_connect_connections_${userId}`, JSON.stringify(localConns));
        }
        success = true;
      } catch (e) {}
    }

    if (success) {
      fetchMatches(userId, user);
    }
  };

  const acceptConnectionRequest = async (connectionId: string) => {
    const userId = user.id;
    const isDemo = userId.startsWith('demo-');
    let success = false;

    // Security Check: retrieve recipient of request
    const saved = localStorage.getItem(`qu_connect_connections_${userId}`);
    const localConns = saved ? JSON.parse(saved) : [];
    let recipient_id = "";
    if (isDemo || connectionId.startsWith('local-conn-') || connectionId === 'demo-seed-request') {
      const conn = localConns.find((c: any) => c.id === connectionId);
      recipient_id = conn?.recipient_id || "";
    }

    // Security boundary: only recipient can accept connection request
    if (isDemo && recipient_id !== userId) {
      console.error("Security boundary violation: only recipient can accept connection.");
      return;
    }

    if (!isDemo && !connectionId.startsWith('local-conn-') && connectionId !== 'demo-seed-request') {
      try {
        const { error } = await supabase
          .from('connections')
          .update({ status: 'accepted', updated_at: new Date().toISOString() })
          .eq('id', connectionId);
        if (!error) success = true;
      } catch (e) {
        console.error("DB connection accept failed:", e);
      }
    }

    if (isDemo || !success) {
      try {
        if (saved) {
          const conn = localConns.find((c: any) => c.id === connectionId);
          if (conn) {
            conn.status = 'accepted';
            localStorage.setItem(`qu_connect_connections_${userId}`, JSON.stringify(localConns));
            success = true;
          }
        }
      } catch (e) {}
    }

    if (success) {
      fetchMatches(userId, user);
    }
  };

  const declineConnectionRequest = async (connectionId: string) => {
    const userId = user.id;
    const isDemo = userId.startsWith('demo-');
    let success = false;

    if (!isDemo && !connectionId.startsWith('local-conn-') && connectionId !== 'demo-seed-request') {
      try {
        const { error } = await supabase
          .from('connections')
          .delete()
          .eq('id', connectionId);
        if (!error) success = true;
      } catch (e) {}
    }

    if (isDemo || !success) {
      try {
        const saved = localStorage.getItem(`qu_connect_connections_${userId}`);
        if (saved) {
          const localConns = JSON.parse(saved);
          const filtered = localConns.filter((c: any) => c.id !== connectionId);
          localStorage.setItem(`qu_connect_connections_${userId}`, JSON.stringify(filtered));
          success = true;
        }
      } catch (e) {}
    }

    if (success) {
      fetchMatches(userId, user);
    }
  };

  const MOCK_STUDENTS_FALLBACK = [
    { id: '1', displayName: 'سارة', gender: 'female' },
    { id: '2', displayName: 'ريم', gender: 'female' },
    { id: '3', displayName: 'عبدالرحمن خالد', gender: 'male' },
    { id: '4', displayName: 'خالد العنزي', gender: 'male' }
  ];

  useEffect(() => {
    const isDemoUser = user.id && user.id.startsWith('demo-');
    if (user.id && user.id !== "me" && (isDemoUser || dbColleges.length > 0)) {
      fetchMatches(user.id, user);
    }
  }, [user.id, user.interests, user.goals, user.college, user.major, user.gender, dbColleges, dbMajors, dbInterests, dbGoals]);

  useEffect(() => {
    // Clear cached demo/user profiles and connections on refresh to guarantee starting fresh
    if (typeof window !== "undefined") {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
          if (k.startsWith('qu_connect_profile_') || k.startsWith('qu_connect_connections_')) {
            localStorage.removeItem(k);
          }
        });
      } catch (e) {}
    }

    // Sign out from Supabase on mount to prevent session auto-restore on refresh
    supabase.auth.signOut().then(() => {
      setSupabaseSession(null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseSession(session);
      if (session) {
        loadAllData(session.user.id);
      } else {
        const isDemoActive = typeof window !== "undefined" && Object.keys(localStorage).some(k => k.startsWith('qu_connect_profile_demo-'));
        if (!isDemoActive) {
          setUser({
            id: "me",
            studentId: "",
            displayName: "",
            gender: "male",
            college: "",
            major: "",
            level: 6,
            interests: [],
            goals: [],
            personality: [],
            communicationPref: "محادثات نصية",
            bio: "",
            avatar: "🎓"
          });
          setScreen(2); // Go to welcome screen on logout
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Apply gender-specific theme class dynamically
  useEffect(() => {
    const root = document.getElementById("qu-connect-app-root");
    if (!root) return;
    
    if (user.gender === "female") {
      root.classList.remove("theme-male");
      root.classList.add("theme-female");
    } else {
      root.classList.remove("theme-female");
      root.classList.add("theme-male");
    }
  }, [user.gender]);

  // Screen routing dictionary mapping
  const renderScreenContent = () => {
    switch (currentScreen) {
      // ONBOARDING
      case 1:
        return <Splash onNext={() => setScreen(2)} />;
      case 2:
        return <Welcome onNext={() => setScreen(25)} t={t} />; // Welcome goes to Language Selector
      case 25:
        return <LanguageSelector onNext={() => setScreen(3)} language={language} setLanguage={changeLanguage} t={t} />; // Language Selector goes to Email Login
      case 3:
        return (
          <Login
            onNext={() => setScreen(4)}
            onDemoNext={(demoId) => loadAllData(demoId)}
            studentId={user.studentId}
            setStudentId={(val) => updateUser({ studentId: val })}
            t={t}
          />
        );
      case 4:
        return (
          <ProfileSetup
            onNext={() => setScreen(8)} // Step 1 goes directly to Step 2 (Interests selection)
            user={user}
            updateUser={updateUser}
            props={screenProps}
          />
        );
      case 8:
        return (
          <Interests
            onNext={() => setScreen(85)} // Step 2 goes to Step 2.5 (Importance selection)
            user={user}
            updateUser={updateUser}
            props={screenProps}
          />
        );
      case 85:
        return (
          <InterestImportance
            onNext={() => setScreen(9)} // Step 2.5 goes to Step 3 (Goals/Gender/Bio)
            onBack={() => setScreen(8)}
            user={user}
            props={screenProps}
          />
        );
      case 9:
        return (
          <Goals
            onComplete={() => {
              // Mark complete and navigate to Home (Screen 10)
              setScreen(10);
              setActiveTab('home');
            }}
            onBack={() => setScreen(85)}
            user={user}
            updateUser={updateUser}
            props={screenProps}
          />
        );

      // MAIN APP
      case 10:
        return <HomeTab props={screenProps} />;
      case 11:
        return <MatchingTab props={screenProps} />;
      case 12:
        return <SuggestedStudents props={screenProps} />;
      case 13:
        return <StudentProfileDetail props={screenProps} />;
      case 14:
        return <ConnectionsTab props={screenProps} />;
      case 15:
        return <ChatScreen props={screenProps} />;
      case 16:
        return <NotificationsScreen props={screenProps} />;
      case 17:
        return <SettingsTab props={screenProps} />;

      default:
        return <Welcome onNext={() => setScreen(25)} t={t} />;
    }
  };

  // Bundle properties
  const screenProps: any = {
    user,
    updateUser,
    activeTab,
    setActiveTab,
    currentScreen,
    setScreen,
    matchedIds,
    setMatchedIds,
    chatThreads,
    setChatThreads,
    notifications,
    setNotifications,
    viewedStudent,
    setViewedStudent,
    activeChatStudent,
    setActiveChatStudent,
    matchedStudentForModal,
    setMatchedStudentForModal,
    isTyping,
    setIsTyping,
    
    // Supabase States
    supabaseSession,
    setSupabaseSession,
    dbColleges,
    dbMajors,
    dbInterests,
    dbGoals,

    // Matching & Connections System
    matches,
    connections,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,

    // Language & Translation
    language,
    changeLanguage,
    t
  };

  return (
    <div id="qu-connect-app-root" className="theme-male w-full h-full flex justify-center items-center" dir={language === 'en' ? 'ltr' : 'rtl'}>
      <MobileFrame>
        {renderScreenContent()}
        {matchedStudentForModal && (
          <MatchSuccessModal 
            student={matchedStudentForModal} 
            onClose={() => setMatchedStudentForModal(null)}
            onChat={() => {
              const student = matchedStudentForModal;
              setMatchedIds(prev => prev.includes(student.id) ? prev : [...prev, student.id]);
              setChatThreads(prev => {
                if (prev[student.id]) return prev;
                return {
                  ...prev,
                  [student.id]: [
                    { sender: 'them', text: `أهلاً بك! لقد توافقنا، ويسعدني التواصل معك بشأن: ${student.goals[0] || 'المذاكرة المشتركة'}`, time: 'الآن' }
                  ]
                };
              });
              setActiveChatStudent(student);
              setMatchedStudentForModal(null);
              setScreen(15);
            }}
            user={user}
          />
        )}
      </MobileFrame>
    </div>
  );
}
