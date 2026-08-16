"use client";

import React, { useState } from "react";
import { COLLEGES, CATEGORIZED_INTERESTS, GOALS, PERSONALITY_PILLS, COMMUNICATION_PREF_RADIO, Student } from "../../data/mockData";
import { supabase } from "../../lib/supabaseClient";

// --- SCREEN 1: SPLASH ---
export function Splash({ onNext }: { onNext: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(onNext, 2500);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div 
      className="flex-1 flex flex-col justify-center items-center bg-gradient-to-b from-[#f4f8f6] to-[#e6eee9] p-6 cursor-pointer select-none text-right"
      onClick={onNext}
    >
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-extrabold text-[#023422] mb-3 font-sans tracking-wide">QU Connect</h1>
        <p className="text-gray-500 font-bold text-base">اكتشف مجتمعك</p>
      </div>
      
      {/* Indicator bar at the bottom */}
      <div className="pb-8 flex items-center gap-1.5 justify-center w-full">
        <div className="w-8 h-1.5 rounded-full bg-emerald-100"></div>
        <div className="w-8 h-1.5 rounded-full bg-[#023422]"></div>
      </div>
    </div>
  );
}

// --- SCREEN 2: WELCOME ---
export function Welcome({ onNext, t }: { onNext: () => void; t: (key: string) => string }) {
  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] p-6 text-right">
      {/* Top bar with Skip option */}
      <div className="flex justify-between items-center pt-2">
        <button 
          type="button" 
          className="text-sm font-bold text-gray-500 hover:text-gray-700"
          onClick={onNext}
        >
          {t('skip')}
        </button>
        <div></div>
      </div>

      {/* Main card with illustration */}
      <div className="my-auto space-y-6">
        <div className="w-full max-w-[320px] mx-auto bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center aspect-square">
          <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
            <svg viewBox="0 0 200 200" className="w-44 h-44 text-[#023422]">
              <circle cx="100" cy="100" r="85" fill="#f4f8f6" />
              <circle cx="70" cy="80" r="14" fill="currentColor" opacity="0.8" />
              <path d="M70 102c-15 0-25 10-25 24v4h50v-4c0-14-10-24-25-24z" fill="currentColor" opacity="0.8" />
              <circle cx="130" cy="75" r="14" fill="currentColor" />
              <path d="M130 97c-15 0-25 10-25 24v4h50v-4c0-14-10-24-25-24z" fill="currentColor" />
              <path d="M85 70h30v15H85z" fill="#e6eee9" />
              <text x="100" y="80" textAnchor="middle" fill="#023422" fontSize="10" fontWeight="bold">QU</text>
            </svg>
            <p className="text-[10px] text-gray-400 mt-2 font-bold tracking-widest uppercase">QU Connect</p>
          </div>
        </div>

        {/* Welcome Taglines */}
        <div className="space-y-3 px-2">
          <h3 className="text-2xl font-black text-[#023422] leading-tight">{t('welcomeTitle')}</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            {t('welcomeDesc')}
          </p>
        </div>
      </div>

      {/* Progress dots & Button */}
      <div className="pb-4 space-y-5">
        <div className="flex justify-center items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#023422]"></div>
        </div>
        
        <button className="qu-btn-primary" onClick={onNext}>
          <span>{t('next')}</span>
        </button>
      </div>
    </div>
  );
}

// --- SCREEN 2.5: LANGUAGE SELECTOR ---
export function LanguageSelector({ 
  onNext, 
  language, 
  setLanguage, 
  t 
}: { 
  onNext: () => void; 
  language: "ar" | "en"; 
  setLanguage: (l: "ar" | "en") => void; 
  t: (key: string) => string; 
}) {
  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] p-6 text-right">
      <div className="pt-8"></div>

      <div className="w-full max-w-[340px] mx-auto bg-white rounded-[32px] border border-gray-100 p-6 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-50 text-[#023422] rounded-full flex items-center justify-center mx-auto text-2xl border border-emerald-100">
            🌐
          </div>
          <h3 className="text-lg font-black text-gray-900">{t('selectLanguage')}</h3>
          <p className="text-xs text-gray-400 font-bold">{t('selectLanguageDesc')}</p>
        </div>

        <div className="space-y-3">
          <div 
            className={`lang-box ${language === "ar" ? "selected" : ""}`}
            onClick={() => setLanguage("ar")}
          >
            <div className="flex items-center gap-2.5">
              {language === "ar" ? (
                <div className="w-5 h-5 rounded-full border-2 border-[#023422] bg-[#023422] flex items-center justify-center text-[10px] text-white font-bold">✓</div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              )}
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <h4 className="text-sm font-bold text-gray-800 font-sans">{t('arabic')}</h4>
                <p className="text-[10px] text-gray-400">Arabic</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#023422] font-black text-xs">
                ع
              </div>
            </div>
          </div>

          <div 
            className={`lang-box ${language === "en" ? "selected" : ""}`}
            onClick={() => setLanguage("en")}
          >
            <div className="flex items-center gap-2.5">
              {language === "en" ? (
                <div className="w-5 h-5 rounded-full border-2 border-[#023422] bg-[#023422] flex items-center justify-center text-[10px] text-white font-bold">✓</div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              )}
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <h4 className="text-sm font-bold text-gray-800">{t('english')}</h4>
                <p className="text-[10px] text-gray-400">English</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#023422] font-black text-xs">
                En
              </div>
            </div>
          </div>
        </div>

        <button className="qu-btn-primary" onClick={onNext}>
          <span>{t('continueEn')}</span>
        </button>
      </div>

      <div className="pb-4"></div>
    </div>
  );
}

// --- SCREEN 3: EMAIL LOGIN ---
export function Login({ 
  onNext, 
  onDemoNext,
  studentId, 
  setStudentId,
  t
}: { 
  onNext: () => void; 
  onDemoNext: (demoId: string) => void;
  studentId: string; 
  setStudentId: (val: string) => void;
  t: (key: string) => string;
}) {
  const [studentIdInput, setStudentIdInput] = useState(studentId || "");
  const [password, setPassword] = useState("");
  const [showDemoOptions, setShowDemoOptions] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = (genderType: 'male' | 'female') => {
    const demoId = genderType === 'male' ? 'demo-student' : 'demo-female-student';
    const cleanId = genderType === 'male' ? 'test1001' : 'test2001';
    setStudentId(cleanId);
    
    // Seed default mock profile to local storage for local demo bypass
    const isMale = genderType === 'male';
    const demoUser = {
      id: demoId,
      studentId: cleanId,
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

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`qu_connect_profile_${demoId}`, JSON.stringify(demoUser));
      } catch (e) {}
    }

    onDemoNext(demoId);
  };

  const handleBypassLogin = (email: string) => {
    const cleanId = email.split('@')[0];
    const mockUserId = `demo-${cleanId}`;
    
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`qu_connect_profile_${mockUserId}`);
        if (!saved) {
          const defaultDemo: Student = {
            id: mockUserId,
            studentId: cleanId,
            displayName: "",
            gender: "male",
            college: "",
            major: "",
            level: 6,
            interests: [],
            goals: [],
            personality: [],
            communicationPref: "",
            bio: "",
            avatar: "🎓"
          };
          localStorage.setItem(`qu_connect_profile_${mockUserId}`, JSON.stringify(defaultDemo));
        }
      } catch (e) {
        console.error("Failed to seed bypass profile in localStorage:", e);
      }
    }
    
    onDemoNext(mockUserId);
  };

  const handleLogin = async (emailVal: string, passwordVal: string) => {
    setError("");
    setLoading(true);
    try {
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: emailVal,
        password: passwordVal
      });

      if (signInErr) {
        console.warn("Supabase Auth failed, falling back to bypass login:", signInErr.message);
        handleBypassLogin(emailVal);
      } else {
        const cleanId = emailVal.split("@")[0];
        setStudentId(cleanId);
        onNext();
      }
    } catch (err: any) {
      console.warn("Exception during Supabase Auth, falling back to bypass login:", err);
      handleBypassLogin(emailVal);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdInput.trim()) {
      setError(t('errorEmptyId'));
      return;
    }

    const email = studentIdInput.includes("@") ? studentIdInput.trim() : `${studentIdInput.trim()}@qu.edu.sa`;
    
    if (password.trim()) {
      handleLogin(email, password);
    } else {
      handleBypassLogin(email);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] p-6 text-right overflow-y-auto custom-scrollbar">
      <div className="pt-4"></div>

      <div className="w-full max-w-[340px] mx-auto bg-white rounded-[32px] border border-gray-100 p-6 shadow-md space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-50 text-[#023422] rounded-full flex items-center justify-center mx-auto text-2xl border border-emerald-100">
            🎓
          </div>
          <h3 className="text-lg font-black text-gray-900 leading-tight font-sans">{t('loginTitle')} 👋</h3>
          <p className="text-[11px] text-gray-500 font-semibold">{t('loginDesc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student ID */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-600 mr-1">{t('studentIdLabel')}</label>
            <div className="qu-input-wrapper">
              <input 
                type="text" 
                placeholder={t('studentIdPlaceholder')} 
                className="qu-input text-left tracking-wide font-medium"
                value={studentIdInput}
                onChange={(e) => {
                  setStudentIdInput(e.target.value);
                  if (error) setError("");
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-600 mr-1">{t('passwordLabel')}</label>
            <div className="qu-input-wrapper">
              <input 
                type="password" 
                placeholder="••••••••" 
                className="qu-input text-left tracking-wide font-medium"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
            </div>
            <p className="text-[9px] text-gray-400 font-bold leading-normal mt-1">{t('passwordTip')}</p>
          </div>

          {error && <p className="text-red-500 text-[10px] mt-1 mr-1 font-bold">⚠️ {error}</p>}

          <button type="submit" className="qu-btn-primary mt-2 flex items-center justify-center gap-2" disabled={loading}>
            <span>{loading ? t('loggingIn') : t('loginBtn')}</span>
          </button>
        </form>


      </div>

      <div className="pb-4"></div>
    </div>
  );
}

// --- SCREEN 4: PROFILE SETUP (ACADEMIC DATA - STEP 1 OF 3) ---
export function ProfileSetup({
  onNext,
  user,
  updateUser,
  props
}: {
  onNext: () => void;
  user: Partial<Student>;
  updateUser: (fields: Partial<Student>) => void;
  props: any;
}) {
  const [name, setName] = useState(user.displayName || "");
  const [selectedCol, setSelectedCol] = useState(user.college || "");
  const [selectedMajor, setSelectedMajor] = useState(user.major || "");
  const [level, setLevel] = useState<number>(user.level || 6);
  const [gender, setGender] = useState<'male' | 'female'>(user.gender || "male");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Map dynamic colleges from Supabase state
  const dynamicColleges = props.dbColleges && props.dbColleges.length > 0
    ? props.dbColleges.map((c: any) => ({
        id: c.id,
        name: c.name_ar,
        majors: props.dbMajors.filter((m: any) => m.college_id === c.id).map((m: any) => m.name_ar)
      }))
    : COLLEGES;

  const selectedColObj = dynamicColleges.find((c: any) => c.name === selectedCol);
  const majorsList = selectedColObj ? selectedColObj.majors : [];

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("الرجاء إدخال اسمك الأول");
      return;
    }
    if (!selectedCol) {
      setError("الرجاء تحديد كليتك");
      return;
    }
    if (!selectedMajor) {
      setError("الرجاء تحديد تخصصك");
      return;
    }
    setError("");
    setLoading(true);

    if (user.id?.startsWith('demo-')) {
      updateUser({
        displayName: name,
        college: selectedCol,
        major: selectedMajor,
        level: level,
        gender: gender
      });
      onNext();
      setLoading(false);
      return;
    }

    try {
      const colId = props.dbColleges.find((c: any) => c.name_ar === selectedCol)?.id;
      const majId = props.dbMajors.find((m: any) => m.name_ar === selectedMajor)?.id;

      const { error: upsertErr } = await supabase.from('profiles').upsert({
        id: user.id,
        first_name: name,
        college_id: colId,
        major_id: majId,
        academic_level: level,
        gender_group: gender,
        student_id: user.studentId
      });

      if (upsertErr) {
        setError(upsertErr.message);
        setLoading(false);
        return;
      }

      updateUser({
        displayName: name,
        college: selectedCol,
        major: selectedMajor,
        level: level,
        gender: gender
      });
      onNext();
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ البيانات الأكاديمية");
    } finally {
      setLoading(false);
    }
  };

  const t = props.t || ((key: string) => key);
  const language = props.language || 'ar';

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] p-6 text-right overflow-y-auto custom-scrollbar">
      <div className="space-y-4">
        {/* Step Indicator */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold mb-1">
          <span>{t('setupStep1')}</span>
          <span className="text-[#023422] uppercase tracking-wide">{t('setupTitle')}</span>
        </div>

        {/* Header Taglines */}
        <div className="space-y-1">
          <h3 className="text-lg font-black text-gray-900 leading-tight font-sans">
            {language === 'en' ? 'Tell us about your studies 📚' : 'أخبرنا عن دراستك 📚'}
          </h3>
          <p className="text-[10px] text-gray-400 font-semibold">
            {language === 'en' ? 'This information helps us suggest compatible peers.' : 'تساعدنا هذه المعلومات في اقتراح الزملاء المناسبين لك.'}
          </p>
        </div>

        {/* Display name field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-600 mr-1">{t('nameLabel')}</label>
          <div className="qu-input-wrapper">
            <input 
              type="text" 
              placeholder={t('namePlaceholder')} 
              className="qu-input font-bold"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
          </div>
        </div>

        {/* Gender Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-600 mr-1">{t('genderLabel')}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`py-3 px-4 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                gender === 'male'
                  ? 'border-blue-200 bg-blue-50 text-blue-900 shadow-sm font-black'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
              onClick={() => {
                setGender('male');
                if (error) setError("");
              }}
            >
              <span className="text-lg">👨</span>
              <span>{t('genderMale')}</span>
            </button>
            <button
              type="button"
              className={`py-3 px-4 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                gender === 'female'
                  ? 'border-pink-200 bg-pink-50 text-pink-900 shadow-sm font-black'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
              onClick={() => {
                setGender('female');
                if (error) setError("");
              }}
            >
              <span className="text-lg">👩</span>
              <span>{t('genderFemale')}</span>
            </button>
          </div>
        </div>

        {/* College selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-600 mr-1">{t('collegeLabel')}</label>
          <div className="qu-select-wrapper">
            <select
              className="qu-select"
              value={selectedCol}
              onChange={(e) => {
                setSelectedCol(e.target.value);
                setSelectedMajor("");
                if (error) setError("");
              }}
            >
              <option value="">{t('collegeSelect')}</option>
              {dynamicColleges.map((col: any) => {
                const displayColName = language === 'en' ? (col.id === 'cc' ? 'College of Computer' : col.id === 'coeng' ? 'College of Engineering' : col.id === 'csci' ? 'College of Science' : col.id === 'cba' ? 'College of Business Administration' : col.id === 'cmed' ? 'College of Medicine' : col.name) : col.name;
                return (
                  <option key={col.id} value={col.name}>
                    {displayColName}
                  </option>
                );
              })}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🏫</span>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
          </div>
        </div>

        {/* Major selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-600 mr-1">{t('majorLabel')}</label>
          <div className="qu-select-wrapper">
            <select
              className="qu-select"
              value={selectedMajor}
              onChange={(e) => {
                setSelectedMajor(e.target.value);
                if (error) setError("");
              }}
              disabled={!selectedCol}
            >
              <option value="">{t('majorSelect')}</option>
              {majorsList.map((major: string) => {
                const displayMajName = language === 'en' ? (
                  major === 'علوم الحاسب' ? 'Computer Science' :
                  major === 'هندسة الحاسب' ? 'Computer Engineering' :
                  major === 'تقنية المعلومات' ? 'Information Technology' :
                  major === 'الأمن السيبراني' ? 'Cybersecurity' :
                  major === 'هندسة كهربائية' ? 'Electrical Engineering' :
                  major === 'هندسة ميكانيكية' ? 'Mechanical Engineering' :
                  major === 'رياضيات' ? 'Mathematics' :
                  major === 'محاسبة' ? 'Accounting' : major
                ) : major;
                return (
                  <option key={major} value={major}>
                    {displayMajName}
                  </option>
                );
              })}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">📖</span>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
          </div>
        </div>

        {/* Level selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-600 mr-1">{t('academicLevelLabel')}</label>
          <div className="qu-select-wrapper">
            <select
              className="qu-select"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((lvl) => (
                <option key={lvl} value={lvl}>
                  {language === 'en' ? `Year ${Math.ceil(lvl/2)} / Level ${lvl}` : `سنة ${Math.ceil(lvl/2)} / مستوى ${lvl}`}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">📅</span>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">▼</span>
          </div>
        </div>
        
        {error && <p className="text-red-500 text-[10px] mt-1 mr-1 font-bold">⚠️ {error}</p>}
      </div>

      <div className="pt-6 pb-2 space-y-4">
        <button className="qu-btn-primary flex items-center justify-center gap-2" onClick={handleSubmit} disabled={loading}>
          <span>{loading ? t('saving') : t('next')}</span>
        </button>
        <button 
          type="button"
          className="w-full text-center text-xs font-bold text-gray-400 hover:text-gray-600"
          onClick={onNext}
        >
          {t('skip')}
        </button>
      </div>
    </div>
  );
}

// --- SCREEN 8: INTERESTS SELECTION (STEP 2 OF 3) (IMAGE 2) ---
export function Interests({
  onNext,
  user,
  updateUser,
  props
}: {
  onNext: () => void;
  user: Partial<Student>;
  updateUser: (fields: Partial<Student>) => void;
  props: any;
}) {
  const [selected, setSelected] = useState<string[]>(user.interests || []);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      setSelected(selected.filter(i => i !== interest));
    } else {
      setSelected([...selected, interest]);
    }
  };

  const CATEGORIES_MAP: Record<string, string> = {
    'Technology': 'التقنية',
    'Creative': 'الإبداع والفنون',
    'Sports': 'الرياضة',
    'Entertainment': 'الترفيه',
    'Community': 'المجتمع والتطوع'
  };

  // Map dynamic interests from Supabase state
  const dynamicCategories = props.dbInterests && props.dbInterests.length > 0
    ? Object.entries(
        props.dbInterests.reduce((acc: any, item: any) => {
          const cat = CATEGORIES_MAP[item.category] || item.category;
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item.name_ar);
          return acc;
        }, {} as Record<string, string[]>)
      ).map(([category, items]) => ({ category, items: items as string[] }))
    : CATEGORIZED_INTERESTS;

  const handleNext = async () => {
    if (selected.length < 5) return;
    setLoading(true);
    if (user.id?.startsWith('demo-')) {
      updateUser({ interests: selected });
      onNext();
      setLoading(false);
      return;
    }

    try {
      // 1. Clean existing interests
      await supabase.from('user_interests').delete().eq('user_id', user.id);

      // 2. Insert new interests
      const interestRows = selected.map(name => {
        const intObj = props.dbInterests.find((i: any) => i.name_ar === name);
        return {
          user_id: user.id,
          interest_id: intObj?.id,
          importance: 0 // Default interested rating
        };
      }).filter(row => row.interest_id !== undefined);

      if (interestRows.length > 0) {
        const { error: insErr } = await supabase.from('user_interests').insert(interestRows);
        if (insErr) {
          console.error("Error inserting user interests:", insErr.message);
        }
      }

      updateUser({ interests: selected });
      onNext();
    } catch (err: any) {
      console.error("Error saving user interests:", err.message);
      updateUser({ interests: selected });
      onNext();
    } finally {
      setLoading(false);
    }
  };

  const t = props.t || ((key: string) => key);
  const language = props.language || 'ar';

  const catNamesEN: Record<string, string> = {
    'التقنية': 'Technology',
    'الإبداع والفنون': 'Creative & Arts',
    'الرياضة': 'Sports',
    'الترفيه': 'Entertainment',
    'المجتمع والتطوع': 'Community & Volunteer'
  };

  const interestNamesEN: Record<string, string> = {
    'الذكاء الاصطناعي': 'AI & Data Science',
    'برمجة وتطوير': 'Programming & Dev',
    'أمن سيبراني': 'Cybersecurity',
    'تصميم واجهات': 'UI/UX Design',
    'الأنمي': 'Anime',
    'ألعاب الفيديو': 'Gaming',
    'أفلام ومسلسلات': 'Movies & Shows',
    'موسيقى': 'Music',
    'كرة القدم': 'Football',
    'كرة السلة': 'Basketball',
    'بادل': 'Padel',
    'لياقة بدنية': 'Fitness',
    'التصوير': 'Photography',
    'التصميم الجرافيكي': 'Graphic Design',
    'الرسم': 'Drawing',
    'كتابة إبداعية': 'Creative Writing',
    'التطوع': 'Volunteering',
    'ريادة الأعمال': 'Entrepreneurship',
    'الأندية الطلابية': 'Student Clubs',
    'النقاشات العامة': 'General Debates'
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] p-5 text-right overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <div className="flex justify-between items-center py-2.5 border-b border-gray-100 bg-[#f4f8f6] mb-3">
          <div className="w-6"></div>
          <h2 className="text-sm font-black text-gray-800 font-sans">QU Connect</h2>
          <button 
            type="button" 
            className="text-xs text-emerald-800 font-bold hover:underline"
            onClick={onNext}
          >
            {t('skip')}
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1 mb-2">
          <h3 className="text-xl font-black text-gray-900 leading-tight">{t('interestsTitle')}</h3>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {t('interestsDesc')}
          </p>
          <div className="text-[10px] text-blue-700 font-bold mr-0.5 mt-1.5">
            {language === 'en' ? `${selected.length} / 5 selected` : `${selected.length} / 5 تم اختيارها`}
          </div>
        </div>

        {/* Categorized interests grid scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-0.5 py-1">
          {dynamicCategories.map((group) => {
            const displayCatName = language === 'en' ? (catNamesEN[group.category] || group.category) : group.category;
            return (
              <div key={group.category} className="space-y-2">
                <h4 className="text-xs font-bold text-[#023422] border-b border-emerald-900/5 pb-1">{displayCatName}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const isSelected = selected.includes(item);
                    const displayItemName = language === 'en' ? (interestNamesEN[item] || item) : item;
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`py-2 px-3.5 rounded-full border text-xs font-semibold transition-all ${
                          isSelected
                            ? "border-[#023422] bg-[#023422] text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                        onClick={() => toggleInterest(item)}
                      >
                        {displayItemName}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue button */}
      <div className="pt-4 pb-2">
        <button
          className="qu-btn-primary flex items-center justify-center"
          onClick={handleNext}
          disabled={selected.length < 5 || loading}
          style={{ 
            backgroundColor: selected.length >= 5 ? 'var(--primary)' : '#e2e8f0', 
            color: selected.length >= 5 ? 'white' : '#718096',
            cursor: selected.length >= 5 ? 'pointer' : 'default'
          }}
        >
          <span>{loading ? t('saving') : t('continue')}</span>
        </button>
      </div>
    </div>
  );
}

// --- SCREEN 8.5: INTEREST IMPORTANCE RATING (IMAGE 1) ---
export function InterestImportance({
  onNext,
  onBack,
  user,
  props
}: {
  onNext: () => void;
  onBack: () => void;
  user: Partial<Student>;
  props: any;
}) {
  const selectedInterests = user.interests || [];
  // Take selected interests or fallbacks for demo
  const displayInterests = selectedInterests.length > 0 ? selectedInterests.slice(0, 4) : ['الذكاء الاصطناعي', 'تطور الألعاب', 'تصميم واجهات المستخدم', 'برمجة الويب'];
  
  // Rating states (0: interested, 1: important, 2: very important)
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const toggleRating = (interest: string, val: number) => {
    setRatings(prev => ({
      ...prev,
      [interest]: val
    }));
  };

  const getIcon = (interest: string) => {
    if (interest.includes("ذكاء") || interest.includes("اصطناع")) return "🤖";
    if (interest.includes("ألعاب") || interest.includes("تطوير")) return "🎮";
    if (interest.includes("واجهات") || interest.includes("تصميم")) return "🎨";
    return "💻";
  };

  const handleNext = async () => {
    setLoading(true);
    if (user.id?.startsWith('demo-')) {
      onNext();
      setLoading(false);
      return;
    }

    try {
      for (const [interestName, rating] of Object.entries(ratings)) {
        const intId = props.dbInterests.find((i: any) => i.name_ar === interestName)?.id;
        if (intId) {
          const { error: updErr } = await supabase.from('user_interests')
            .update({ importance: rating })
            .eq('user_id', user.id)
            .eq('interest_id', intId);
          if (updErr) {
            console.error("Error updating interest importance:", updErr.message);
          }
        }
      }
      onNext();
    } catch (err: any) {
      console.error("Exception updating interest importance:", err.message);
      onNext();
    } finally {
      setLoading(false);
    }
  };

  const t = props.t || ((key: string) => key);
  const language = props.language || 'ar';

  const interestNamesEN: Record<string, string> = {
    'الذكاء الاصطناعي': 'AI & Data Science',
    'برمجة وتطوير': 'Programming & Dev',
    'أمن سيبراني': 'Cybersecurity',
    'تصميم واجهات': 'UI/UX Design',
    'الأنمي': 'Anime',
    'ألعاب الفيديو': 'Gaming',
    'أفلام ومسلسلات': 'Movies & Shows',
    'موسيقى': 'Music',
    'كرة القدم': 'Football',
    'كرة السلة': 'Basketball',
    'بادل': 'Padel',
    'لياقة بدنية': 'Fitness',
    'التصوير': 'Photography',
    'التصميم الجرافيكي': 'Graphic Design',
    'الرسم': 'Drawing',
    'كتابة إبداعية': 'Creative Writing',
    'التطوع': 'Volunteering',
    'ريادة الأعمال': 'Entrepreneurship',
    'الأندية الطلابية': 'Student Clubs',
    'النقاشات العامة': 'General Debates'
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] p-6 text-right overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Indicator bar */}
        <div className="flex justify-between items-center py-2.5 mb-2.5">
          <button type="button" className="text-sm font-bold text-gray-400" onClick={onNext}>{t('skip')}</button>
          <div className="w-20 h-1 bg-gray-200 rounded-full flex flex-row-reverse overflow-hidden">
            <div className="w-2/3 h-full bg-[#023422]"></div>
          </div>
          <button type="button" className="w-8 h-8 rounded-full bg-emerald-50 text-[#023422] flex items-center justify-center font-bold text-sm" onClick={onBack}>
            →
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1 mb-4">
          <h3 className="text-xl font-black text-gray-900 leading-tight">{t('interestsImportanceTitle')}</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            {t('interestsImportanceDesc')}
          </p>
        </div>

        {/* Interests Cards list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-0.5">
          {displayInterests.map((interest) => {
            const currentRating = ratings[interest] ?? 0;
            const categoryIcon = getIcon(interest);
            const displayInterestName = language === 'en' ? (interestNamesEN[interest] || interest) : interest;

            return (
              <div 
                key={interest}
                className="bg-emerald-50/40 border border-emerald-100/50 p-4 rounded-[24px] space-y-3 text-right"
              >
                {/* Interest Title */}
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">{displayInterestName}</span>
                </div>

                {/* Rating options (three columns) */}
                <div className="grid grid-cols-3 gap-2 select-none">
                  {/* Very Important */}
                  <button
                    type="button"
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold border text-center transition-all ${
                      currentRating === 2
                        ? "border-[#023422] bg-[#023422] text-white"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                    }`}
                    onClick={() => toggleRating(interest, 2)}
                  >
                    {t('importanceVeryImportant')}
                  </button>

                  {/* Important */}
                  <button
                    type="button"
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold border text-center transition-all ${
                      currentRating === 1
                        ? "border-[#023422] bg-[#023422] text-white"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                    }`}
                    onClick={() => toggleRating(interest, 1)}
                  >
                    {t('importanceImportant')}
                  </button>

                  {/* Interested */}
                  <button
                    type="button"
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold border text-center transition-all ${
                      currentRating === 0
                        ? "border-[#023422] bg-[#023422] text-white"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                    }`}
                    onClick={() => toggleRating(interest, 0)}
                  >
                    {t('importanceNormal')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 pb-2">
        <button className="qu-btn-primary flex items-center justify-center" onClick={handleNext} disabled={loading}>
          <span>{loading ? t('saving') : t('continue')}</span>
        </button>
      </div>
    </div>
  );
}

// --- SCREEN 9: GOALS & DETAILS SETUP (STEP 3 OF 3) (IMAGE 3) ---
export function Goals({
  onComplete,
  onBack,
  user,
  updateUser,
  props
}: {
  onComplete: () => void;
  onBack: () => void;
  user: Partial<Student>;
  updateUser: (fields: Partial<Student>) => void;
  props: any;
}) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(user.goals || []);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>(user.personality || []);
  const [commPref, setCommPref] = useState(user.communicationPref || "محادثات نصية");
  const [gender, setGender] = useState<'male' | 'female'>(user.gender || "male");
  const [bio, setBio] = useState(user.bio || "");
  const [loading, setLoading] = useState(false);

  const toggleGoal = (goalName: string) => {
    if (selectedGoals.includes(goalName)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goalName));
    } else {
      setSelectedGoals([...selectedGoals, goalName]);
    }
  };

  const togglePersonality = (tag: string) => {
    if (selectedPersonality.includes(tag)) {
      setSelectedPersonality(selectedPersonality.filter(p => p !== tag));
    } else {
      setSelectedPersonality([...selectedPersonality, tag]);
    }
  };

  // Map dynamic goals list from Supabase
  const dynamicGoalsList = props.dbGoals && props.dbGoals.length > 0
    ? props.dbGoals.map((g: any) => {
        const icons: Record<number, string> = { 1: '📚', 2: '🤝', 3: '💻', 4: '🏆', 5: '🎮', 6: '💡' };
        const descs: Record<number, string> = {
          1: 'البحث عن طلاب للمذاكرة المشتركة وتبادل الملاحظات.',
          2: 'التعرف على أشخاص يشاركونك نفس الاهتمامات.',
          3: 'التعاون في مشاريع الفصل أو مشاريع التخرج.',
          4: 'المشاركة في الأندية الطلابية والفعاليات الجامعية.',
          5: 'البحث عن أشخاص يشاركونك نفس الهوايات والألعاب.',
          6: 'التواصل مع طلاب في مستويات متقدمة للاستفادة من خبراتهم.'
        };
        return {
          id: g.id,
          name: g.name_ar,
          desc: descs[g.id] || 'التفاعل والمشاركة في الأنشطة الطلابية والتعلم.',
          icon: icons[g.id] || '✨'
        };
      })
    : GOALS;

  const handleFinish = async () => {
    setLoading(true);
    if (user.id?.startsWith('demo-')) {
      const finalAvatar = user.gender === "female" ? "👩‍🔬" : "👨‍💻";
      const finalBio = bio || "أبحث عن زملاء دراسة متوافقين.";
      updateUser({ 
        goals: selectedGoals,
        personality: selectedPersonality,
        communicationPref: commPref,
        gender: user.gender || "male",
        bio: finalBio,
        avatar: finalAvatar
      });
      onComplete();
      setLoading(false);
      return;
    }

    try {
      // 1. Delete and insert user_goals
      await supabase.from('user_goals').delete().eq('user_id', user.id);
      const goalRows = selectedGoals.map(name => {
        const goalObj = props.dbGoals.find((g: any) => g.name_ar === name);
        return {
          user_id: user.id,
          goal_id: goalObj?.id
        };
      }).filter(row => row.goal_id !== undefined);

      if (goalRows.length > 0) {
        const { error: glErr } = await supabase.from('user_goals').insert(goalRows);
        if (glErr) console.error("Error inserting goals:", glErr.message);
      }

      // 2. Update profiles table with final gender, avatar, and bio
      const finalAvatar = user.gender === "female" ? "👩‍🔬" : "👨‍💻";
      const finalBio = bio || "أبحث عن زملاء دراسة متوافقين.";
      
      const { error: profErr } = await supabase.from('profiles').update({
        bio: finalBio,
        avatar_url: finalAvatar,
        gender_group: user.gender || "male"
      }).eq('id', user.id);

      if (profErr) console.error("Error updating profile final details:", profErr.message);

      // 3. Save social preferences
      const dbCommPrefMap: Record<string, string> = {
        'محادثات نصية': 'chat',
        'لقاءات دراسية': 'study',
        'فعاليات جماعية': 'group'
      };
      const { error: socErr } = await supabase.from('social_preferences').upsert({
        user_id: user.id,
        communication_type: dbCommPrefMap[commPref] || 'chat',
        personality_preference: selectedPersonality.join(',')
      });

      if (socErr) console.error("Error saving social preferences:", socErr.message);

      updateUser({ 
        goals: selectedGoals,
        personality: selectedPersonality,
        communicationPref: commPref,
        gender: user.gender || "male",
        bio: finalBio,
        avatar: finalAvatar
      });
      onComplete();
    } catch (e: any) {
      console.error("Exception completing onboarding:", e.message);
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  const t = props.t || ((key: string) => key);
  const language = props.language || 'ar';

  const goalNamesEN: Record<string, string> = {
    'شريك مذاكرة': 'Study Partner',
    'أصدقاء جدد': 'New Friends',
    'توجيه وإرشاد': 'Academic Guidance',
    'أنشطة وفعاليات': 'Clubs & Activities',
    'التعاون في مشاريع': 'Project Collaboration',
    'الاهتمامات والهوايات': 'Shared Hobbies'
  };

  const goalDescsEN: Record<string, string> = {
    'شريك مذاكرة': 'Find students to study together and share lecture notes.',
    'أصدقاء جدد': 'Meet people who share the same academic or general interests.',
    'توجيه وإرشاد': 'Connect with senior students to learn from their experience.',
    'أنشطة وفعاليات': 'Join student clubs and participate in campus events.',
    'التعاون في مشاريع': 'Collaborate on class or graduation projects.',
    'الاهتمامات والهوايات': 'Find students who share your gaming, sports, or artistic hobbies.'
  };

  const personalityEN: Record<string, string> = {
    'اجتماعي': 'Social',
    'هادئ': 'Quiet / Calm',
    'طموح': 'Ambitious',
    'مبدع': 'Creative',
    'تحليلي': 'Analytical',
    'متعاون': 'Cooperative'
  };

  const commPrefEN: Record<string, string> = {
    'محادثات نصية': 'Text Chat',
    'لقاءات دراسية': 'Study Meetings',
    'فعاليات جماعية': 'Group Events'
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] p-6 text-right overflow-y-auto custom-scrollbar">
      <div className="space-y-5">
        {/* Step Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
            <span>{t('goalsTitle')}</span>
            <span>{t('goalsStep3')}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex flex-row-reverse">
            <div className="w-full h-full bg-[#023422]"></div>
          </div>
        </div>

        {/* Back Link */}
        <div>
          <button 
            type="button" 
            className="text-[11px] text-emerald-800 font-bold mb-2 flex items-center gap-1"
            onClick={onBack}
          >
            <span>{language === 'en' ? '← Back to Interests' : 'رجوع للاهتمامات'}</span>
          </button>
          <h3 className="text-xl font-black text-gray-900 leading-tight font-sans">{t('goalsTitle')}</h3>
          <p className="text-[11px] text-gray-500">{t('goalsDesc')}</p>
        </div>

        {/* Goals selection card list */}
        <div className="space-y-2.5">
          {dynamicGoalsList.map((goal: any) => {
            const isSelected = selectedGoals.includes(goal.name);
            const displayName = language === 'en' ? (goalNamesEN[goal.name] || goal.name) : goal.name;
            const displayDesc = language === 'en' ? (goalDescsEN[goal.name] || goal.desc) : goal.desc;
            return (
              <div 
                key={goal.id}
                className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3 cursor-pointer ${
                  isSelected ? 'border-[#023422] bg-emerald-50/40' : 'border-gray-100 bg-white'
                }`}
                onClick={() => toggleGoal(goal.name)}
              >
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  readOnly
                  className="mt-1 accent-[#023422]" 
                />
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 justify-end mb-0.5">
                    <span className="text-xs font-bold text-gray-800">{displayName}</span>
                    <span className="text-lg">{goal.icon}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal">{displayDesc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Personality tags selection */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#023422]">{t('personalitySection')}</h4>
          <div className="flex flex-wrap gap-2 justify-start">
            {PERSONALITY_PILLS.map((tag) => {
              const isSelected = selectedPersonality.includes(tag);
              const displayTagName = language === 'en' ? (personalityEN[tag] || tag) : tag;
              return (
                <button
                  key={tag}
                  type="button"
                  className={`py-1.5 px-3 rounded-full border text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-[#023422] bg-[#023422] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                  onClick={() => togglePersonality(tag)}
                >
                  {displayTagName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Communication preferences (Radio mock buttons) */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-[#023422]">{t('commPrefSection')}</h4>
          <div className="space-y-2">
            {COMMUNICATION_PREF_RADIO.map((pref) => {
              const isSelected = commPref === pref;
              const displayPrefName = language === 'en' ? (commPrefEN[pref] || pref) : pref;
              return (
                <div
                  key={pref}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected ? 'border-[#023422] bg-emerald-50/35 font-bold text-[#023422]' : 'border-gray-100 bg-white text-gray-600'
                  }`}
                  onClick={() => setCommPref(pref)}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#023422]"></div>}
                  </div>
                  <span className="text-xs">{displayPrefName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick bio input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-600 mr-1">{t('bioLabel')}</label>
          <input
            type="text"
            placeholder={t('bioPlaceholder')}
            className="qu-input !text-xs !py-3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

      </div>

      <div className="pt-6 pb-2">
        <button 
          className="qu-btn-primary flex items-center justify-center" 
          onClick={handleFinish}
          disabled={selectedGoals.length === 0 || loading}
          style={{ opacity: selectedGoals.length > 0 ? 1 : 0.6 }}
        >
          <span>{loading ? t('saving') : t('finishBtn')}</span>
        </button>
      </div>
    </div>
  );
}
