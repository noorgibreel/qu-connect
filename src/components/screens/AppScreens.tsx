"use client";

import React, { useState, useEffect, useRef } from "react";
import { Student, MOCK_STUDENTS, COLLEGES } from "../../data/mockData";
import { supabase } from "../../lib/supabaseClient";

interface AppScreensProps {
  user: Student;
  updateUser: (fields: Partial<Student>) => void;
  activeTab: 'home' | 'matches' | 'connections' | 'profile' | 'notifications';
  setActiveTab: (tab: 'home' | 'matches' | 'connections' | 'profile' | 'notifications') => void;
  currentScreen: number;
  setScreen: (screen: number) => void;
  
  // States
  matchedIds: string[];
  setMatchedIds: React.Dispatch<React.SetStateAction<string[]>>;
  chatThreads: Record<string, { sender: 'me' | 'them'; text: string; time: string }[]>;
  setChatThreads: React.Dispatch<React.SetStateAction<Record<string, { sender: 'me' | 'them'; text: string; time: string }[]>>>;
  notifications: { id: string; text: string; time: string; read: boolean }[];
  setNotifications: React.Dispatch<React.SetStateAction<{ id: string; text: string; time: string; read: boolean }[]>>;
  
  viewedStudent: Student | null;
  setViewedStudent: (student: Student | null) => void;
  activeChatStudent: Student | null;
  setActiveChatStudent: (student: Student | null) => void;
  
  matchedStudentForModal: Student | null;
  setMatchedStudentForModal: React.Dispatch<React.SetStateAction<Student | null>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  
  dbColleges: any[];
  dbMajors: any[];
  dbInterests: any[];
  dbGoals: any[];
  matches: Student[];
  connections: any[];
  sendConnectionRequest: (recipientId: string) => Promise<void>;
  acceptConnectionRequest: (connectionId: string) => Promise<void>;
  declineConnectionRequest: (connectionId: string) => Promise<void>;
  
  // Language & Translation
  language: 'ar' | 'en';
  changeLanguage: (lang: 'ar' | 'en') => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

// --- SCREEN HEADER ---
function ScreenshotHeader({ onProfileClick, title = "QU Connect" }: { onProfileClick: () => void; title?: string }) {
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-100 select-none z-50">
      <button type="button" className="text-gray-500 hover:text-gray-700 p-1 text-lg">
        🔍
      </button>
      
      <h1 className="text-base font-extrabold text-[#023422] font-sans">{title}</h1>
      
      <div 
        className="w-8 h-8 rounded-full border border-gray-200 bg-emerald-50 flex items-center justify-center text-sm cursor-pointer overflow-hidden shadow-inner hover:scale-105 transition-all"
        onClick={onProfileClick}
      >
        👩‍🎓
      </div>
    </div>
  );
}

// --- BOTTOM NAVIGATION BAR (ARABIC LABELS EXACTLY MATCHING IMAGE 1, 2, 3) ---
function ScreenshotBottomNav({ activeTab, setActiveTab, setScreen, t }: { 
  activeTab: 'home' | 'matches' | 'connections' | 'profile' | 'notifications'; 
  setActiveTab: (tab: 'home' | 'matches' | 'connections' | 'profile' | 'notifications') => void;
  setScreen: (screen: number) => void;
  t: (key: string) => string;
}) {
  const tabs = [
    { id: 'profile', label: t('tabProfile'), icon: '👤', screen: 17 },
    { id: 'notifications', label: t('tabAlerts'), icon: '🔔', screen: 16 },
    { id: 'connections', label: t('tabChats'), icon: '💬', screen: 14 },
    { id: 'matches', label: t('tabDiscover'), icon: '🧭', screen: 11 },
    { id: 'home', label: t('tabHome'), icon: '🏠', screen: 10 }
  ] as const;

  return (
    <div className="flex border-t border-gray-100 bg-white py-2 px-2 justify-around items-center select-none z-50">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            className={`flex flex-col items-center gap-0.5 flex-1 py-1 transition-all relative ${
              isActive ? "text-[#023422] font-black scale-105" : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => {
              setActiveTab(tab.id);
              setScreen(tab.screen);
            }}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[9px] tracking-tight">{tab.label}</span>
            {isActive && (
              <span className="absolute bottom-0 w-1.5 h-1.5 bg-[#023422] rounded-full"></span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function HomeTab({ props }: { props: AppScreensProps }) {
  const { user, setScreen, setViewedStudent, matches, t, language } = props;
  const recommendedStudents = matches || [];

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
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] overflow-hidden">
      <ScreenshotHeader onProfileClick={() => { props.setActiveTab('profile'); setScreen(17); }} />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 text-right">
        {/* Welcome greeting */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-1.5 justify-end">
            <span>👋</span>
            <span>{t('welcomeUser', { name: user.displayName || 'نور' })}</span>
          </h2>
          <p className="text-xs text-gray-400 font-bold">{t('haveMatches')}</p>
        </div>

        {/* Section title */}
        <div className="flex justify-between items-baseline pt-2">
          <button 
            type="button" 
            className="text-xs font-bold text-[#023422] hover:underline"
            onClick={() => setScreen(12)}
          >
            {t('viewAll')}
          </button>
          <h3 className="text-sm font-extrabold text-gray-900">{t('topMatches')}</h3>
        </div>

        {/* Recommended list of custom student cards */}
        <div className="space-y-4">
          {recommendedStudents.length === 0 ? (
            <div className="bg-white rounded-[28px] border border-gray-100 p-8 text-center space-y-3">
              <span className="text-4xl block">🔍</span>
              <h4 className="text-sm font-black text-gray-800">{t('noMatches')}</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed max-w-[240px] mx-auto">
                {t('noMatchesDesc')}
              </p>
            </div>
          ) : (
            recommendedStudents.slice(0, 3).map((student: Student) => {
              const displayCollege = language === 'en' ? (
                student.college === 'كلية الحاسب' ? 'College of Computer' :
                student.college === 'كلية الهندسة' ? 'College of Engineering' :
                student.college === 'كلية العلوم' ? 'College of Science' :
                student.college === 'كلية إدارة الأعمال' ? 'College of Business' : student.college
              ) : student.college;

              const displayMajor = language === 'en' ? (
                student.major === 'علوم الحاسب' ? 'Computer Science' :
                student.major === 'هندسة الحاسب' ? 'Computer Engineering' :
                student.major === 'تقنية المعلومات' ? 'Information Technology' :
                student.major === 'الأمن السيبراني' ? 'Cybersecurity' :
                student.major === 'هندسة كهربائية' ? 'Electrical Engineering' :
                student.major === 'هندسة ميكانيكية' ? 'Mechanical Engineering' :
                student.major === 'رياضيات' ? 'Mathematics' :
                student.major === 'محاسبة' ? 'Accounting' : student.major
              ) : student.major;

              const displayLevel = language === 'en' ? `Year ${Math.ceil(student.level/2)}` : `سنة ${Math.ceil(student.level/2)}`;

              return (
                <div 
                  key={student.id}
                  className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-xs space-y-3.5"
                >
                  <div className="flex items-start justify-between">
                    {/* Left: Compatibility Badge */}
                    <div className="bg-[#f4f8f6] px-3.5 py-1.5 rounded-2xl text-center flex flex-col items-center">
                      <span className="text-sm font-extrabold text-[#023422]">{student.compatibility}%</span>
                      <span className="text-[8px] text-gray-400 font-bold tracking-tight">{t('compatibility')}</span>
                    </div>

                    {/* Right: Student Avatar & name info */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <h4 className="text-sm font-bold text-gray-800">{student.displayName}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                          {displayCollege} / {displayMajor} / {displayLevel}
                        </p>
                      </div>
                      <div className="text-2xl w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100/30 overflow-hidden">
                        {student.avatar}
                      </div>
                    </div>
                  </div>

                  {/* Tag pills */}
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {student.interests.slice(0, 3).map((tag: string, idx: number) => {
                      const colors = [
                        'bg-blue-50 text-blue-900 border-blue-100',
                        'bg-pink-50 text-pink-900 border-pink-100',
                        'bg-emerald-50 text-emerald-950 border-emerald-100'
                      ];
                      const displayTag = language === 'en' ? (interestNamesEN[tag] || tag) : tag;
                      return (
                        <span 
                          key={idx} 
                          className={`text-[9px] font-bold px-3 py-1 rounded-full border ${colors[idx % colors.length]}`}
                        >
                          {displayTag}
                        </span>
                      );
                    })}
                  </div>

                  {/* Boxed sparkle compatibility statement */}
                  <div className="bg-[#f4f8f6] border border-emerald-100/30 p-3.5 rounded-2xl flex items-start gap-2.5">
                    <div className="text-xs text-[#023422]">✨</div>
                    <p className="flex-1 text-[10px] leading-relaxed text-gray-500 font-medium text-right">
                      {student.sparkleText || (language === 'en' ? 'You share mutual interests and academic goals.' : 'تشتركان في الاهتمامات والأهداف الأكاديمية.')}
                    </p>
                  </div>

                  {/* View Profile CTA button */}
                  <button 
                    type="button" 
                    className="qu-btn-primary !py-2.5 !text-xs"
                    onClick={() => {
                      setViewedStudent(student);
                      setScreen(13);
                    }}
                  >
                    {language === 'en' ? 'View Profile' : 'عرض الملف'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ScreenshotBottomNav activeTab={props.activeTab} setActiveTab={props.setActiveTab} setScreen={setScreen} t={t} />
    </div>
  );
}

// --- SCREEN 11: DISCOVER TAB (REPLICATED FROM IMAGE 5) ---
export function MatchingTab({ props }: { props: AppScreensProps }) {
  const { user, setScreen, matchedIds } = props;
  const discoverPool = props.matches || [];
  const [search, setSearch] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  const handleConnect = (student: Student) => {
    const conn = (props.connections || []).find((c: any) => 
      (c.requester_id === user.id && c.recipient_id === student.id) ||
      (c.requester_id === student.id && c.recipient_id === user.id)
    );
    if (conn && conn.status === 'accepted') {
      props.setActiveChatStudent(student);
      setScreen(15);
      return;
    }
    props.sendConnectionRequest(student.id);
  };

  const filteredPool = discoverPool.filter((student: Student) => {
    const matchesSearch = !search.trim() || 
      student.displayName.toLowerCase().includes(search.toLowerCase()) ||
      student.major.toLowerCase().includes(search.toLowerCase()) ||
      student.college.toLowerCase().includes(search.toLowerCase()) ||
      student.interests.some((interest: string) => interest.toLowerCase().includes(search.toLowerCase()));

    const matchesInterest = !selectedInterest || student.interests.includes(selectedInterest);
    return matchesSearch && matchesInterest;
  });

  const userInterests = user.interests && user.interests.length > 0 
    ? user.interests 
    : ["الذكاء الاصطناعي", "برمجة وتطوير", "تصميم واجهات", "ألعاب الفيديو", "التطوع"];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] overflow-hidden">
      <ScreenshotHeader onProfileClick={() => { props.setActiveTab('profile'); setScreen(17); }} />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5 text-right">
        <h2 className="text-2xl font-black text-gray-900">اكتشف</h2>

        {/* Search bar input */}
        <div className="qu-input-wrapper">
          <input 
            type="text" 
            placeholder="ابحث عن زملاء، مواد، أو مجموعات..." 
            className="qu-input text-sm py-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        {/* Interests Categories chips */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-baseline">
            <button 
              type="button" 
              className="text-xs font-bold text-gray-400 hover:underline"
              onClick={() => setScreen(8)}
            >
              تعديل
            </button>
            <h3 className="text-xs font-black text-gray-500 mr-0.5">حسب اهتماماتك</h3>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <button
              type="button"
              className={`text-[9px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                selectedInterest === null
                  ? "border-[#023422] bg-[#023422] text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
              onClick={() => setSelectedInterest(null)}
            >
              الكل
            </button>
            {userInterests.map((interest) => {
              const isSelected = selectedInterest === interest;
              return (
                <button
                  key={interest}
                  type="button"
                  className={`text-[9px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                    isSelected
                      ? "border-[#023422] bg-[#023422] text-white"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedInterest(interest)}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal scrolling students list */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-gray-500 mr-0.5">طلاب لديهم اهتمامات مشابهة</h3>
          
          {filteredPool.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-3 pt-1 px-1 custom-scrollbar scroll-smooth flex-row-reverse">
              {filteredPool.map((student: Student) => (
                <div 
                  key={student.id}
                  className="bg-white border border-gray-100 p-4 rounded-[28px] shadow-sm text-center space-y-3 min-w-[200px] max-w-[200px] flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="text-3xl w-14 h-14 bg-[#f4f8f6] rounded-full flex items-center justify-center mx-auto border border-emerald-100/30 overflow-hidden">
                      {student.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{student.displayName}</h4>
                      <p className="text-[9px] text-gray-400 mt-0.5">{student.major} - مستوى {student.level}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center">
                    {student.interests.slice(0, 2).map((interest: string, i: number) => (
                      <span key={i} className="text-[8px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                        {interest}
                      </span>
                    ))}
                  </div>

                  {(() => {
                    const conn = (props.connections || []).find((c: any) => 
                      (c.requester_id === user.id && c.recipient_id === student.id) ||
                      (c.requester_id === student.id && c.recipient_id === user.id)
                    );
                    const buttonText = conn 
                      ? conn.status === 'accepted'
                        ? "متصل 💬"
                        : conn.requester_id === user.id
                          ? "تم الإرسال"
                          : "قبول الطلب"
                      : "تواصل";
                    return (
                      <button 
                        type="button"
                        className={`w-full py-2 text-[10px] font-bold rounded-xl transition-all border active:scale-95 ${
                          conn && conn.status === 'accepted'
                            ? "bg-emerald-50 text-[#023422] border-emerald-100"
                            : conn && conn.requester_id === user.id
                              ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                              : conn && conn.recipient_id === user.id
                                ? "bg-emerald-800 text-white border-emerald-900"
                                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-100"
                        }`}
                        onClick={() => {
                          if (conn && conn.status === 'pending' && conn.recipient_id === user.id) {
                            props.acceptConnectionRequest(conn.id);
                          } else if (!conn || conn.status === 'accepted') {
                            handleConnect(student);
                          }
                        }}
                      >
                        {buttonText}
                      </button>
                    );
                  })()}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white border border-gray-100 rounded-[28px] p-6 space-y-2">
              <span className="text-3xl block">🔍</span>
              <h4 className="text-xs font-bold text-gray-700">لم نجد نتائج مطابقة</h4>
              <p className="text-[10px] text-gray-400">جرب كتابة كلمات أخرى أو إلغاء فلترة الاهتمامات.</p>
            </div>
          )}
        </div>
      </div>

      <ScreenshotBottomNav activeTab={props.activeTab} setActiveTab={props.setActiveTab} setScreen={setScreen} t={props.t} />
    </div>
  );
}

// --- SCREEN 12: SUGGESTED STUDENTS LIST ---
export function SuggestedStudents({ props }: { props: AppScreensProps }) {
  const { user, setScreen, setViewedStudent, matches } = props;
  const matchingPool = matches || [];

  return (
    <div className="flex-1 flex flex-col justify-between bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center gap-3">
          <button 
            type="button" 
            className="text-base font-bold text-emerald-800"
            onClick={() => setScreen(10)}
          >
            →
          </button>
          <h2 className="text-sm font-extrabold text-gray-900 font-sans">المقترحات الأكثر توافقاً</h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {matchingPool.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-gray-100 p-8 text-center space-y-3">
              <span className="text-4xl block">🔍</span>
              <h4 className="text-sm font-black text-gray-800">لا توجد مطابقات كافية حاليًا</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed max-w-[240px] mx-auto">
                يُرجى محاولة إضافة المزيد من الاهتمامات أو تعديل خيارات ملفك الشخصي للتعرف على زملاء متوافقين.
              </p>
            </div>
          ) : (
            matchingPool.map((student: Student) => (
              <div
                key={student.id}
                className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:border-gray-200 transition-all"
                onClick={() => {
                  setViewedStudent(student);
                  setScreen(13);
                }}
              >
                <div className="text-3xl w-12 h-12 bg-[#f4f8f6] rounded-full flex items-center justify-center border border-emerald-100/30 overflow-hidden">
                  {student.avatar}
                </div>
                <div className="flex-1 text-right">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold text-gray-800">{student.displayName}</h4>
                    <span className="text-[9px] font-extrabold text-emerald-800 bg-[#f4f8f6] px-2 py-0.5 rounded-full">
                      {student.compatibility}% توافق
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{student.college} • {student.major}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ScreenshotBottomNav activeTab={props.activeTab} setActiveTab={props.setActiveTab} setScreen={setScreen} t={props.t} />
    </div>
  );
}

// --- SCREEN 13: STUDENT PROFILE DETAIL (REPLICATED FROM IMAGE 1) ---
export function StudentProfileDetail({ props }: { props: AppScreensProps }) {
  const { viewedStudent, setScreen, user } = props;

  const student = viewedStudent || MOCK_STUDENTS[0];

  const [geminiExplanation, setGeminiExplanation] = useState<string | null>(null);
  const [geminiPoints, setGeminiPoints] = useState<string[]>([]);
  const [geminiLoading, setGeminiLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setGeminiExplanation(null);
    setGeminiPoints([]);
    
    if (!student || student.id === user.id) return;
    
    const fetchGeminiAnalysis = async () => {
      setGeminiLoading(true);
      try {
        const response = await fetch('/api/compatibility', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: {
              displayName: user.displayName,
              college: user.college,
              major: user.major,
              level: user.level,
              interests: user.interests,
              goals: user.goals
            },
            candidate: {
              displayName: student.displayName,
              college: student.college,
              major: student.major,
              level: student.level,
              interests: student.interests,
              goals: student.goals
            }
          })
        });

        if (!response.ok) {
          throw new Error('API failed');
        }

        const data = await response.json();
        if (active && data) {
          if (data.explanation) setGeminiExplanation(data.explanation);
          if (data.points) setGeminiPoints(data.points);
        }
      } catch (e) {
        console.error("Gemini compatibility fetch failed, using fallback:", e);
      } finally {
        if (active) setGeminiLoading(false);
      }
    };

    fetchGeminiAnalysis();
    return () => {
      active = false;
    };
  }, [student.id, user.id]);

  const conn = (props.connections || []).find((c: any) => 
    (c.requester_id === user.id && c.recipient_id === student.id) ||
    (c.requester_id === student.id && c.recipient_id === user.id)
  );

  const handleConnect = () => {
    if (conn && conn.status === 'accepted') {
      props.setActiveChatStudent(student);
      setScreen(15);
      return;
    }
    props.sendConnectionRequest(student.id);
  };

  const buttonText = conn
    ? conn.status === 'accepted'
      ? "متصل 💬"
      : conn.requester_id === user.id
        ? "تم الإرسال"
        : "قبول الطلب"
    : "تواصل 💬";

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
          <div></div>
          <h2 className="text-sm font-black text-gray-800 font-sans">تفاصيل المطابقة</h2>
          <button 
            type="button" 
            className="text-base font-bold text-gray-800"
            onClick={() => setScreen(10)} // Back to Home
          >
            →
          </button>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 text-right">
          {/* Main Card */}
          <div className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-xs text-center space-y-4 relative">
            {/* Compatibility score at top left */}
            <span className="absolute top-4 left-4 text-[10px] font-extrabold bg-[#f4f8f6] text-[#023422] px-3.5 py-1.5 rounded-full border border-emerald-100/20">
              {student.compatibility || 95}% توافق
            </span>

            {/* Avatar Circle */}
            <div className="text-4xl w-18 h-18 bg-[#cfe2ff] text-blue-900 rounded-full flex items-center justify-center mx-auto border-2 border-white shadow-sm overflow-hidden font-bold">
              {student.avatar || student.displayName[0]}
            </div>

            {/* Name & Academic year info */}
            <div>
              <h3 className="text-base font-black text-gray-900">{student.displayName}</h3>
              <p className="text-[11px] text-gray-400 font-semibold mt-1">
                🎓 {student.college} • {student.major} • السنة {Math.ceil(student.level/2)}
              </p>
            </div>

            {/* Connection actions */}
            <div className="flex gap-2 justify-center pt-2 select-none">
              <button 
                type="button" 
                className="w-11 h-11 bg-emerald-50 text-[#023422] border border-emerald-100/30 rounded-xl flex items-center justify-center text-lg active:scale-95 transition-all"
              >
                🔖
              </button>
              <button 
                className={`qu-btn-primary flex-1 !py-2.5 !text-xs ${
                  conn && conn.status === 'accepted'
                    ? "!bg-emerald-50 !text-[#023422] border border-emerald-100"
                    : conn && conn.requester_id === user.id
                      ? "!bg-gray-100 !text-gray-500 border border-gray-200 cursor-not-allowed"
                      : conn && conn.recipient_id === user.id
                        ? "!bg-emerald-800 !text-white border border-emerald-900"
                        : "!bg-[#023422]"
                }`} 
                onClick={() => {
                  if (conn && conn.status === 'pending' && conn.recipient_id === user.id) {
                    props.acceptConnectionRequest(conn.id);
                  } else if (!conn || conn.status === 'accepted') {
                    handleConnect();
                  }
                }}
              >
                {buttonText}
              </button>
            </div>
          </div>

          {/* Why compatible box card */}
          <div className="bg-pink-50/20 border border-pink-100/30 p-5 rounded-[28px] space-y-3 text-right">
            <h4 className="text-xs font-black text-gray-800 flex items-center gap-1.5 justify-end">
              <span>لماذا قد تتوافقان؟</span>
              <span className="text-pink-600">✨</span>
            </h4>
            
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              {geminiExplanation || student.sparkleText || "تشتركان في الاهتمامات والأهداف الأكاديمية."}
            </p>

            {geminiLoading && (
              <p className="text-[9px] text-[#023422] font-semibold animate-pulse">
                ⏳ جاري تحديث التحليل بالذكاء الاصطناعي...
              </p>
            )}

            {geminiPoints.length > 0 && (
              <div className="pt-2 border-t border-pink-100/30 space-y-1.5 text-right">
                {geminiPoints.map((point: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-1.5 justify-end">
                    <span className="text-[10px] text-gray-600 font-semibold">{point}</span>
                    <span className="text-pink-500 text-xs leading-none">•</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grid properties: Shared interests and Shared goals */}
          <div className="grid grid-cols-2 gap-3">
            {/* Shared goals */}
            <div className="bg-white border border-gray-100 p-4 rounded-[28px] space-y-2">
              <h4 className="text-[10px] font-black text-gray-800 flex items-center gap-1.5 justify-end border-b border-gray-50 pb-1.5">
                <span>أهداف مشتركة</span>
                <span>🏳️</span>
              </h4>
              <div className="space-y-1 text-[9px] text-gray-400 font-bold leading-normal">
                {student.goals.map((g, idx) => (
                  <div key={idx}>• {g}</div>
                ))}
              </div>
            </div>

            {/* Shared interests */}
            <div className="bg-white border border-gray-100 p-4 rounded-[28px] space-y-2">
              <h4 className="text-[10px] font-black text-gray-800 flex items-center gap-1.5 justify-end border-b border-gray-50 pb-1.5">
                <span>اهتمامات مشتركة</span>
                <span>❤️</span>
              </h4>
              <div className="flex flex-wrap gap-1 justify-end">
                {student.interests.slice(0, 3).map((interest, idx) => (
                  <span key={idx} className="text-[8px] bg-blue-50 text-blue-900 border border-blue-100 px-2 py-0.5 rounded-full font-bold">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio statement card */}
          <div className="bg-white border border-gray-100 p-5 rounded-[28px] space-y-2">
            <h4 className="text-xs font-black text-[#023422]">نبذة عني</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              {student.bio}
            </p>
          </div>
        </div>
      </div>

      <ScreenshotBottomNav activeTab={props.activeTab} setActiveTab={props.setActiveTab} setScreen={setScreen} t={props.t} />
    </div>
  );
}

// --- SCREEN 14: CONNECTIONS LIST (CHATS TAB) ---
export function ConnectionsTab({ props }: { props: AppScreensProps }) {
  const { setScreen, acceptConnectionRequest, declineConnectionRequest, user } = props;

  const getStudentInfo = (id: string) => {
    const st = (props.matches || []).find((m: any) => m.id === id);
    if (st) return st;

    const mockStudents = [
      {
        id: '3',
        displayName: 'عبدالرحمن خالد',
        college: 'كلية الحاسب',
        major: 'علوم الحاسب',
        level: 5,
        avatar: '👨‍💻',
        gender: 'male',
        compatibility: 85
      },
      {
        id: '4',
        displayName: 'خالد العنزي',
        college: 'كلية الهندسة',
        major: 'هندسة كهربائية',
        level: 6,
        avatar: '👷‍♂️',
        gender: 'male',
        compatibility: 78
      },
      {
        id: '2',
        displayName: 'ريم',
        college: 'كلية الهندسة',
        major: 'هندسة كهربائية',
        level: 4,
        avatar: '👩‍🔬',
        gender: 'female',
        compatibility: 88
      },
      {
        id: '1',
        displayName: 'سارة',
        college: 'كلية الحاسب',
        major: 'تقنية المعلومات',
        level: 3,
        avatar: '👩‍💻',
        gender: 'female',
        compatibility: 92
      }
    ];
    return mockStudents.find(s => s.id === id) || {
      id,
      displayName: 'مستخدم QU',
      college: 'جامعة القصيم',
      major: 'طالب',
      level: 6,
      avatar: '🎓',
      gender: 'male',
      compatibility: 50
    };
  };

  const incomingRequests = (props.connections || []).filter((c: any) => 
    c.recipient_id === user.id && c.status === 'pending'
  );

  const myConnections = (props.connections || []).filter((c: any) => 
    (c.requester_id === user.id || c.recipient_id === user.id) && c.status === 'accepted'
  );

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] overflow-hidden">
      <ScreenshotHeader onProfileClick={() => { props.setActiveTab('profile'); setScreen(17); }} />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5 text-right">
        {/* Title */}
        <h2 className="text-2xl font-black text-gray-900 leading-tight">اتصالاتي</h2>

        {/* SECTION 1: INCOMING REQUESTS */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-gray-500 mr-0.5">الطلبات الواردة ({incomingRequests.length})</h3>
          
          {incomingRequests.length > 0 ? (
            <div className="space-y-3">
              {incomingRequests.map((req: any) => {
                const sender = getStudentInfo(req.requester_id);
                return (
                  <div 
                    key={req.id}
                    className="bg-white p-4 rounded-[28px] border border-gray-100 shadow-sm space-y-3 text-right animate-fade-in"
                  >
                    <div className="flex items-start justify-between">
                      <div className="bg-[#f4f8f6] px-2.5 py-1 rounded-xl text-center">
                        <span className="text-[11px] font-extrabold text-[#023422]">{sender.compatibility}%</span>
                        <span className="text-[8px] text-gray-400 block font-bold leading-none">توافق</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <h4 className="text-xs font-bold text-gray-800">{sender.displayName}</h4>
                          <p className="text-[9px] text-gray-400 font-semibold mt-0.5">
                            {sender.college} / {sender.major}
                          </p>
                        </div>
                        <div className="text-xl w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 overflow-hidden">
                          {sender.avatar}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 select-none">
                      <button
                        type="button"
                        className="py-2 bg-[#023422] hover:bg-emerald-950 text-white text-[10px] font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1"
                        onClick={() => acceptConnectionRequest(req.id)}
                      >
                        <span>✓</span>
                        <span>قبول</span>
                      </button>
                      <button
                        type="button"
                        className="py-2 bg-gray-50 hover:bg-gray-100 text-red-600 border border-red-100 text-[10px] font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1"
                        onClick={() => declineConnectionRequest(req.id)}
                      >
                        <span>✗</span>
                        <span>رفض</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center text-xs text-gray-400 font-medium">
              لا توجد طلبات واردة حالياً.
            </div>
          )}
        </div>

        {/* SECTION 2: MY CONNECTIONS */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black text-gray-500 mr-0.5">اتصالاتي المقبولة ({myConnections.length})</h3>

          {myConnections.length > 0 ? (
            <div className="space-y-2.5">
              {myConnections.map((conn: any) => {
                const peerId = conn.requester_id === user.id ? conn.recipient_id : conn.requester_id;
                const peer = getStudentInfo(peerId);

                return (
                  <div
                    key={conn.id}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between text-right cursor-pointer hover:border-gray-200 transition-all"
                    onClick={() => {
                      props.setActiveChatStudent(peer as any);
                      setScreen(15);
                    }}
                  >
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#023422] rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div>
                      <span className="text-[9px] font-black">متصل</span>
                    </div>

                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <div className="text-right overflow-hidden">
                        <h4 className="text-xs font-bold text-gray-800">{peer.displayName}</h4>
                        <p className="text-[9px] text-gray-400 mt-0.5 truncate">
                          {peer.college} / {peer.major}
                        </p>
                      </div>
                      <div className="text-2xl w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 overflow-hidden">
                        {peer.avatar}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center text-xs text-gray-400 font-medium space-y-1">
              <p>لم تتصل بأي زملاء بعد.</p>
              <button 
                type="button"
                className="text-[10px] text-[#023422] font-black hover:underline"
                onClick={() => {
                  props.setActiveTab('matches');
                  setScreen(11);
                }}
              >
                اكتشف الطلاب المتوافقين الآن
              </button>
            </div>
          )}
        </div>
      </div>

      <ScreenshotBottomNav activeTab={props.activeTab} setActiveTab={props.setActiveTab} setScreen={setScreen} t={props.t} />
    </div>
  );
}

// --- SCREEN 15: CHAT SCREEN (REPLICATED FROM IMAGE 2) ---
export function ChatScreen({ props }: { props: AppScreensProps }) {
  const { activeChatStudent, setScreen, chatThreads, setChatThreads, isTyping, setIsTyping } = props;
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fallback student if null
  const student = activeChatStudent || MOCK_STUDENTS[0];
  const thread = chatThreads[student.id] || [
    { sender: 'them', text: 'السلام عليكم أحمد، شفت اهتمامك بالذكاء الاصطناعي في ملفك. حابين نتعاون في مشروع التخرج؟', time: '10:30 ص' },
    { sender: 'me', text: 'وعليكم السلام! أهلاً بك. فعلاً، مهتم جداً بالمجال. فكرة ممتازة، متى ممكن نجتمع نناقش التفاصيل؟', time: '10:35 ص' },
    { sender: 'them', text: 'وش رأيك بكرا بعد العصر في مكتبة الجامعة؟', time: '10:38 ص' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const myMsg = {
      sender: 'me' as const,
      text: inputText,
      time: 'الآن'
    };

    setChatThreads(prev => ({
      ...prev,
      [student.id]: [...(prev[student.id] || thread), myMsg]
    }));
    setInputText("");
    
    // Simulate typing indicator
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = "تمام ممتاز! يناسبني نتقابل الساعة 4 عصراً.";
      if (inputText.includes("بكرة") || inputText.includes("بكر") || inputText.includes("غدا") || inputText.includes("غداً")) {
        replyText = "موافق، نلتقي هناك إن شاء الله في بهو المكتبة.";
      } else if (inputText.includes("كيفك") || inputText.includes("شلونك") || inputText.includes("سلام")) {
        replyText = "الحمد لله بخير! يسعدني جداً تواصلنا للتعاون الدراسي.";
      } else if (inputText.includes("تخصص") || inputText.includes("دراسه") || inputText.includes("دراسة")) {
        replyText = "صحيح، تخصصنا رائع ونحتاج مشاركة المصادر لتسهيل الفهم.";
      }
      
      setChatThreads(prev => ({
        ...prev,
        [student.id]: [
          ...(prev[student.id] || []),
          { sender: 'them' as const, text: replyText, time: 'الآن' }
        ]
      }));
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] overflow-hidden">
      {/* Custom Mockup Chat Header */}
      <div className="px-4 py-3.5 border-b border-gray-100 bg-white flex items-center justify-between z-50">
        {/* Left: Call and settings action */}
        <div className="flex items-center gap-3">
          <button type="button" className="text-gray-500 hover:text-gray-700 text-lg">⋮</button>
          <button type="button" className="text-gray-500 hover:text-gray-700 text-lg">📞</button>
        </div>

        {/* Right: Avatar photo, name & status */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <h3 className="text-xs font-bold text-gray-800">{student.displayName}</h3>
            {isTyping ? (
              <p className="text-[9px] text-[#023422] font-black flex items-center gap-1 justify-end animate-pulse">
                <span>●</span>
                <span>يكتب الآن...</span>
              </p>
            ) : (
              <p className="text-[9px] text-blue-500 font-bold flex items-center gap-1 justify-end">
                <span>●</span>
                <span>متصل الآن</span>
              </p>
            )}
          </div>
          <div className="text-2xl w-9 h-9 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 overflow-hidden">
            {student.avatar}
          </div>
          <button 
            type="button" 
            className="text-base font-bold text-emerald-800"
            onClick={() => setScreen(14)} // Back to connections list
          >
            ←
          </button>
        </div>
      </div>

      {/* Message Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {/* System matching banner */}
        <div className="bg-[#e6eee9] border border-emerald-100/50 p-3.5 rounded-2xl text-center text-[10px] text-emerald-950 font-bold leading-normal">
          أصبحتم على تواصل 🎉 ولديكما اهتمام مشترك بالذكاء الاصطناعي 🤖
        </div>

        <div className="text-center text-[10px] text-gray-400 font-bold select-none py-1">اليوم</div>

        {thread.map((msg, idx) => {
          const isMe = msg.sender === 'me';
          return (
            <div 
              key={idx} 
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} text-right`}
            >
              <div className="flex flex-col items-end gap-1 max-w-[80%]">
                <div 
                  className={`px-4 py-2.5 rounded-[20px] text-xs leading-relaxed ${
                    isMe 
                      ? 'bg-[#023422] text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-2xs'
                  }`}
                  style={isMe ? { backgroundColor: 'var(--accent)' } : undefined}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-400 mr-1.5 mt-0.5">
                  {isMe && <span className="text-emerald-700">✓✓</span>}
                  <span>{msg.time}</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Typing bubble indicator inside list */}
        {isTyping && (
          <div className="flex justify-start text-right">
            <div className="flex flex-col items-start gap-1">
              <div className="typing-bubble">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
              <div className="text-[8px] text-gray-400 mr-1.5 mt-0.5">
                {student.displayName} يكتب...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel with smile & attachment */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2.5 items-center select-none">
        {/* Left send button */}
        <button 
          type="submit" 
          className="w-10 h-10 rounded-full bg-[#023422] text-white flex items-center justify-center font-bold active:scale-95 transition-all text-xs"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          ارسل
        </button>

        {/* Text Input area */}
        <div className="qu-input-wrapper flex-1">
          <input 
            type="text" 
            placeholder="اكتب رسالة..." 
            className="qu-input !py-3 !text-xs !bg-gray-50 !pl-10 !pr-10"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          {/* Smiley emoji icon on the right */}
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer hover:text-gray-600">
            😃
          </span>
          {/* Attachment paperclip icon on the left */}
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm cursor-pointer hover:text-gray-600">
            📎
          </span>
        </div>
      </form>
    </div>
  );
}

// --- SCREEN 16: NOTIFICATIONS SCREEN (REPLICATED FROM IMAGE 3) ---
interface ConnectionStatusItem {
  id: string;
  name: string;
  studentObj: Student;
  status: string;
  pillText?: string;
  subInfo?: string;
  time?: string;
  buttons?: string[];
  type: string;
}

export function NotificationsScreen({ props }: { props: AppScreensProps }) {
  const { setScreen, notifications, setNotifications, matchedIds, setMatchedIds, setChatThreads, setActiveChatStudent, setActiveTab } = props;

  useEffect(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  // Dynamic Connection Statuses State
  const [localStatuses, setLocalStatuses] = useState<ConnectionStatusItem[]>([
    {
      id: "state_1",
      name: "عبدالرحمن خالد",
      studentObj: MOCK_STUDENTS.find(s => s.displayName.includes("عبدالرحمن")) || MOCK_STUDENTS[0],
      status: "تم إرسال طلب التواصل ✨",
      pillText: "إلغاء",
      type: "sent"
    },
    {
      id: "state_2",
      name: "سارة",
      studentObj: MOCK_STUDENTS.find(s => s.displayName.includes("سارة")) || MOCK_STUDENTS[0],
      status: "طلب تواصل جديد",
      subInfo: "طالبة علوم حاسب - مستوى 3",
      time: "الآن",
      buttons: ["قبول", "رفض"],
      type: "incoming"
    },
    {
      id: "state_3",
      name: "ريم",
      studentObj: MOCK_STUDENTS.find(s => s.displayName.includes("ريم")) || MOCK_STUDENTS[0],
      status: "أصبحتم على تواصل 🎉",
      pillText: "ابدأ المحادثة 💬",
      type: "matched"
    }
  ]);

  const handleAccept = (item: typeof localStatuses[0]) => {
    // Add to matches
    const student = item.studentObj;
    setMatchedIds(prev => prev.includes(student.id) ? prev : [...prev, student.id]);
    
    // Add chat thread
    setChatThreads(prev => {
      if (prev[student.id]) return prev;
      return {
        ...prev,
        [student.id]: [
          { sender: 'them', text: `أهلاً بك! أنا سارة، يسعدني قبول طلبك. كيف يمكنني مساعدتك في الدراسة؟`, time: 'الآن' }
        ]
      };
    });

    // Update local state
    setLocalStatuses(prev => prev.map(s => {
      if (s.id === item.id) {
        return {
          ...s,
          status: "أصبحتم على تواصل 🎉",
          pillText: "ابدأ المحادثة 💬",
          buttons: undefined,
          type: "matched"
        };
      }
      return s;
    }));
  };

  const handleReject = (item: typeof localStatuses[0]) => {
    setLocalStatuses(prev => prev.map(s => {
      if (s.id === item.id) {
        return {
          ...s,
          status: "تم رفض الطلب 🚫",
          buttons: undefined,
          type: "rejected"
        };
      }
      return s;
    }));
  };

  const handleCancel = (item: typeof localStatuses[0]) => {
    setLocalStatuses(prev => prev.map(s => {
      if (s.id === item.id) {
        return {
          ...s,
          status: "تم إلغاء الطلب ✕",
          pillText: undefined,
          type: "cancelled"
        };
      }
      return s;
    }));
  };

  const handlePillClick = (item: typeof localStatuses[0]) => {
    if (item.type === "matched" || item.pillText === "ابدأ المحادثة 💬") {
      setActiveChatStudent(item.studentObj);
      setActiveTab('connections');
      setScreen(15);
    } else if (item.type === "sent" || item.pillText === "إلغاء") {
      handleCancel(item);
    }
  };

  const appNotifications = [
    {
      id: "notif_1",
      title: "تم قبول طلب التواصل من نورة سعد",
      time: "منذ ساعتين",
      avatar: "👩‍🎓",
      hasBadge: true
    },
    {
      id: "notif_2",
      title: "فهد العتيبي أرسل لك رسالة جديدة",
      subText: "هل يمكننا مناقشة مشروع التخرج غداً؟",
      time: "الآن",
      avatar: "👨‍🎓",
      unread: true
    },
    {
      id: "notif_3",
      title: "Match جديد متوافق مع اهتماماتك 🎯",
      time: "منذ 5 ساعات",
      unread: false,
      avatarSymbol: "⭐"
    }
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#f4f8f6] overflow-hidden">
      {/* Top Header */}
      <ScreenshotHeader onProfileClick={() => { props.setActiveTab('profile'); setScreen(17); }} />

      {/* Main Notifications Scrollable View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5 text-right">
        
        {/* SECTION 1: Connection Statuses */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-gray-900 mr-0.5">حالات التواصل</h3>
          
          <div className="space-y-3">
            {localStatuses.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-gray-100 p-4 rounded-[24px] shadow-2xs space-y-3 text-right"
              >
                <div className="flex items-center justify-between">
                  {/* Left Pill Action Button */}
                  {item.pillText && (
                    <button 
                      type="button" 
                      className={`px-4 py-1.5 border rounded-full text-[10px] font-bold transition-all active:scale-95 ${
                        item.type === "matched"
                          ? "bg-[#023422] text-white border-transparent hover:bg-emerald-950"
                          : "bg-gray-50 border-gray-200/50 hover:bg-gray-100 text-gray-500"
                      }`}
                      onClick={() => handlePillClick(item)}
                    >
                      {item.pillText}
                    </button>
                  )}

                  {/* Accept/Reject Buttons */}
                  {item.buttons && (
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        className="px-4 py-1.5 bg-[#023422] text-white rounded-full text-[10px] font-bold active:scale-95 transition-all"
                        onClick={() => handleAccept(item)}
                      >
                        قبول
                      </button>
                      <button 
                        type="button" 
                        className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-full text-[10px] font-bold active:scale-95 transition-all"
                        onClick={() => handleReject(item)}
                      >
                        رفض
                      </button>
                    </div>
                  )}

                  {/* Right Header detail */}
                  <div className="flex items-center gap-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{item.name}</h4>
                      <p className="text-[9px] text-gray-400 mt-0.5 font-bold flex items-center gap-1 justify-end">
                        {item.time && <span className="text-[8px] text-gray-300">({item.time})</span>}
                        <span>{item.status}</span>
                      </p>
                      {item.subInfo && (
                        <p className="text-[8px] text-gray-400 mt-0.5">{item.subInfo}</p>
                      )}
                    </div>
                    
                    {/* Circle user icon */}
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#023422] flex items-center justify-center text-xs font-bold border border-emerald-100/30 overflow-hidden text-[16px]">
                      {item.studentObj.avatar}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: General Notifications */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-gray-900 mr-0.5">الإشعارات</h3>

          <div className="space-y-2.5">
            {appNotifications.map((notif) => (
              <div 
                key={notif.id}
                className="bg-white border border-gray-100 p-4 rounded-[24px] shadow-2xs flex items-center gap-3.5 relative"
              >
                {/* Left side info dot */}
                {notif.unread && (
                  <span className="w-2 h-2 rounded-full bg-red-500 absolute left-4 top-1/2 -translate-y-1/2 animate-pulse"></span>
                )}

                {/* Right side Text */}
                <div className="flex-1 text-right">
                  <h4 className="text-xs font-bold text-gray-800 leading-normal">{notif.title}</h4>
                  {notif.subText && (
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{notif.subText}</p>
                  )}
                  <span className="block text-[8px] text-gray-300 mt-1 font-bold">{notif.time}</span>
                </div>

                {/* Right side circle symbol/avatar */}
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100/30 text-sm relative">
                  {notif.avatarSymbol ? (
                    <span className="text-yellow-600">{notif.avatarSymbol}</span>
                  ) : (
                    <span>{notif.avatar}</span>
                  )}
                  {notif.hasBadge && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border border-white text-white text-[7px] rounded-full flex items-center justify-center font-bold">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <ScreenshotBottomNav activeTab={props.activeTab} setActiveTab={props.setActiveTab} setScreen={setScreen} t={props.t} />
    </div>
  );
}

// --- SCREEN 17: SETTINGS & ACCOUNT TAB ---
export function SettingsTab({ props }: { props: AppScreensProps }) {
  const { user, updateUser, setScreen } = props;
  const [tempName, setTempName] = useState(user.displayName);
  const [college, setCollege] = useState(user.college || "");
  const [major, setMajor] = useState(user.major || "");
  const [level, setLevel] = useState(user.level || 6);
  const [gender, setGender] = useState<'male' | 'female'>(user.gender || "male");
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "🎓");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const dynamicColleges = props.dbColleges && props.dbColleges.length > 0
    ? props.dbColleges.map((c: any) => ({
        id: c.id,
        name: c.name_ar,
        majors: props.dbMajors.filter((m: any) => m.college_id === c.id).map((m: any) => m.name_ar)
      }))
    : COLLEGES;

  const selectedColObj = dynamicColleges.find((c: any) => c.name === college);
  const majorsList = selectedColObj ? selectedColObj.majors : [];

  const avatarsList = ["🎓", "👨‍💻", "👩‍💻", "🧑‍🎓", "👩‍🎓", "👨‍🎓", "🧑‍🔬", "👩‍🔬", "💡", "📚"];

  const handleSave = async () => {
    if (!tempName.trim()) return;
    setLoading(true);
    try {
      const colId = props.dbColleges.find((c: any) => c.name_ar === college)?.id;
      const majId = props.dbMajors.find((m: any) => m.name_ar === major)?.id;

      // 1. Update profiles table
      const { error: profErr } = await supabase.from('profiles').update({
        first_name: tempName,
        college_id: colId,
        major_id: majId,
        academic_level: level,
        gender_group: gender,
        bio: bio,
        avatar_url: avatar
      }).eq('id', user.id);

      if (profErr) {
        console.error("Error updating profile in settings:", profErr.message);
      }

      // 2. Upsert social preferences
      const dbCommPrefMap: Record<string, string> = {
        'محادثات نصية': 'chat',
        'لقاءات دراسية': 'study',
        'فعاليات جماعية': 'group'
      };
      const { error: socErr } = await supabase.from('social_preferences').upsert({
        user_id: user.id,
        communication_type: dbCommPrefMap[user.communicationPref] || 'chat',
        personality_preference: user.personality.join(',')
      });

      if (socErr) {
        console.error("Error saving social preferences in settings:", socErr.message);
      }

      updateUser({ 
        displayName: tempName,
        college,
        major,
        level,
        gender,
        bio,
        avatar
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e: any) {
      console.error("Exception saving profile in settings:", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-gray-50 overflow-hidden">
      <ScreenshotHeader onProfileClick={() => {}} title="الملف الشخصي" />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 text-right">
        {/* Profile Card */}
        <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm text-center space-y-2.5">
          <div className="text-4xl w-14 h-14 bg-[#f4f8f6] rounded-full flex items-center justify-center mx-auto border border-emerald-100/30 overflow-hidden">
            {avatar}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800">{tempName || user.displayName || "نور"}</h4>
            <p className="text-xs text-gray-500 font-semibold">{college || "الكلية"} • {major || "التخصص"}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">مستوى دراسي {level}</p>
          </div>
        </div>

        {/* Edit profile detail */}
        <div className="bg-white p-4 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-emerald-900 border-b border-gray-50 pb-2">تعديل ملفي الشخصي</h3>
          
          {/* Name field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-600">الاسم الأول</label>
            <input
              type="text"
              className="qu-input !py-2.5 !text-xs"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
          </div>

          {/* College field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-600">الكلية</label>
            <div className="qu-select-wrapper">
              <select
                className="qu-select !py-2.5 !text-xs !pr-8"
                value={college}
                onChange={(e) => {
                  setCollege(e.target.value);
                  setMajor("");
                }}
              >
                <option value="">اختر الكلية</option>
                {dynamicColleges.map((col: any) => (
                  <option key={col.id} value={col.name}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Major field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-600">التخصص</label>
            <div className="qu-select-wrapper">
              <select
                className="qu-select !py-2.5 !text-xs !pr-8"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                disabled={!college}
              >
                <option value="">اختر التخصص</option>
                {majorsList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Level field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-600">المستوى الدراسي</label>
            <div className="qu-select-wrapper">
              <select
                className="qu-select !py-2.5 !text-xs !pr-8"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    سنة {Math.ceil(lvl/2)} / مستوى {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gender theme toggler */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-600">الهوية (تتحكم في سمة الألوان تلقائياً)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                  gender === "male"
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
                onClick={() => setGender("male")}
              >
                طالب 👨
              </button>
              <button
                type="button"
                className={`py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                  gender === "female"
                    ? "border-pink-600 bg-pink-50 text-pink-900"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
                onClick={() => setGender("female")}
              >
                طالبة 👩
              </button>
            </div>
          </div>

          {/* Avatar selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-600">اختر صورتك التعبيرية</label>
            <div className="flex flex-wrap gap-2 justify-end bg-gray-50 p-2.5 rounded-2xl">
              {avatarsList.map((av) => (
                <button
                  key={av}
                  type="button"
                  className={`w-9 h-9 rounded-full text-base flex items-center justify-center transition-all ${
                    avatar === av 
                      ? "bg-white border-2 border-[#023422] scale-110 shadow-xs" 
                      : "hover:bg-white/80"
                  }`}
                  onClick={() => setAvatar(av)}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Bio field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-600">عبارة قصيرة عن نفسك</label>
            <textarea
              className="qu-input !py-2.5 !text-xs !h-16 text-right"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="اكتب نبذة هنا..."
            />
          </div>

          <button 
            type="button" 
            className="qu-btn-primary !py-2.5 !text-xs"
            onClick={handleSave}
          >
            حفظ البيانات
          </button>
          
          {success && (
            <p className="text-center text-[10px] text-green-600 font-bold">✓ تم حفظ البيانات بنجاح!</p>
          )}
        </div>

        {/* Danger reset logouts */}
        <button
          type="button"
          className="qu-btn-secondary !text-red-600 !border-red-200 hover:!bg-red-50 !py-2.5 !text-xs font-bold"
          onClick={() => {
            if (typeof window !== "undefined") {
              try {
                localStorage.removeItem(`qu_connect_profile_${user.id}`);
              } catch (e) {}
            }
            updateUser({
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
            setScreen(2);
          }}
        >
          تسجيل الخروج وإعادة تعيين الحساب
        </button>
      </div>

      <ScreenshotBottomNav activeTab={props.activeTab} setActiveTab={props.setActiveTab} setScreen={setScreen} t={props.t} />
    </div>
  );
}

// --- BUMBLE-STYLE MATCH SUCCESS MODAL ---
export function MatchSuccessModal({ 
  student, 
  onClose, 
  onChat,
  user
}: { 
  student: Student; 
  onClose: () => void; 
  onChat: () => void;
  user: Student;
}) {
  return (
    <div className="qu-modal-backdrop">
      <div className="qu-modal-content">
        {/* Confetti celebration icon */}
        <div className="text-4xl animate-bounce mb-2 select-none">🎉</div>
        
        {/* Title matching screenshot design */}
        <h2 className="text-lg font-black mb-1">توافق أكاديمي!</h2>
        <p className="text-[10px] text-emerald-100 opacity-90 mb-4 leading-normal">
          أنت و {student.displayName} تبحثان عن نفس الأهداف الأكاديمية
        </p>

        {/* Bumble overlapping avatars */}
        <div className="match-avatars select-none">
          <div className="avatar-match-circle">
            {user.avatar || "🎓"}
          </div>
          <div className="match-heart">
            ❤️
          </div>
          <div className="avatar-match-circle" style={{ borderColor: 'var(--accent)' }}>
            {student.avatar || "👨‍🎓"}
          </div>
        </div>

        {/* Compatibility badge */}
        <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 mb-6 text-[10px] font-extrabold text-white">
          نسبة التوافق {student.compatibility || 95}%
        </div>

        {/* Interactive action buttons */}
        <div className="w-full space-y-2">
          <button 
            type="button"
            className="qu-btn-accent !w-full !py-3 !text-xs font-extrabold flex items-center justify-center gap-2"
            onClick={onChat}
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <span>ابدأ المحادثة الآن</span>
            <span>💬</span>
          </button>
          
          <button 
            type="button"
            className="w-full py-2.5 bg-transparent border border-white/20 hover:bg-white/5 text-white text-[10px] font-bold rounded-xl transition-all active:scale-95"
            onClick={onClose}
          >
            استمر في الاستكشاف 🧭
          </button>
        </div>
      </div>
    </div>
  );
}
