export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Welcome / Splash
    welcomeTitle: "تواصل بذكاء مع زملائك في جامعة القصيم",
    welcomeDesc: "تواصل مع طلاب جامعة القصيم الذين يشاركونك الشغف والاهتمامات الأكاديمية.",
    next: "التالي",
    continue: "متابعة",
    continueEn: "متابعة / Continue",

    // Language Selector
    selectLanguage: "اختيار اللغة",
    selectLanguageDesc: "Select your preferred language",
    arabic: "العربية",
    english: "English",

    // Login
    loginTitle: "تسجيل الدخول",
    loginDesc: "أدخل رقمك الجامعي للاتصال بزملائك",
    studentIdLabel: "الرقم الجامعي أو البريد الإلكتروني",
    studentIdPlaceholder: "4XXXXXXX أو student@qu.edu.sa",
    passwordLabel: "كلمة المرور (اختياري)",
    passwordPlaceholder: "أدخل كلمة المرور الخاصة بك",
    passwordTip: "💡 اترك كلمة المرور فارغة لتسجيل الدخول السريع مباشرة دون التحقق",
    loginBtn: "تسجيل الدخول",
    loggingIn: "جاري تسجيل الدخول...",
    errorEmptyId: "الرجاء إدخال الرقم الجامعي أو البريد الإلكتروني",
    errorBypassFail: "حدث خطأ أثناء الدخول السريع",

    // Step 1: Profile Setup
    setupTitle: "تهيئة الملف الشخصي",
    setupStep1: "الخطوة 1 من 3",
    nameLabel: "الاسم الأول",
    namePlaceholder: "أدخل اسمك الأول",
    collegeLabel: "الكلية",
    collegeSelect: "اختر الكلية",
    majorLabel: "التخصص",
    majorSelect: "اختر التخصص أولاً",
    academicLevelLabel: "المستوى الأكاديمي",
    genderLabel: "الجنس",
    genderMale: "طالب",
    genderFemale: "طالبة",
    saving: "جاري الحفظ...",

    // Step 2: Interests
    interestsTitle: "اختر اهتماماتك",
    interestsStep2: "الخطوة 2 من 3",
    interestsDesc: "اختر 5 اهتمامات على الأقل لمساعدتنا في العثور على زملائك المتوافقين.",
    skip: "تخطي",
    selectedInterestsCount: "تم اختيار {count} اهتمامات",

    // Step 3: Goals & Bio
    goalsTitle: "أهدافك وتفاصيلك",
    goalsStep3: "الخطوة 3 من 3",
    goalsDesc: "ما الذي تبحث عنه في QU Connect؟ اختر أهدافك واكتب نبذة بسيطة عنك.",
    goalsSection: "أهداف الاتصال (يمكنك اختيار متعدد)",
    personalitySection: "صفاتك الشخصية (اختر 3)",
    commPrefSection: "وسيلتك المفضلة للتواصل",
    bioLabel: "نبذة تعريفية بسيطة",
    bioPlaceholder: "اكتب شيئاً عن اهتماماتك الأكاديمية أو هواياتك...",
    finishBtn: "إنهاء وإكمال الملف",

    // Dashboard Tabs
    tabHome: "الرئيسية",
    tabConnections: "الاتصالات",
    tabChats: "المحادثات",
    tabProfile: "الملف الشخصي",
    tabAlerts: "التنبيهات",
    tabDiscover: "اكتشف",

    // Dashboard / Home Tab
    welcomeUser: "أهلاً {name}",
    haveMatches: "لدينا أشخاص قد تتوافق معهم",
    topMatches: "أفضل التوافقات",
    viewAll: "عرض الكل",
    noMatches: "لا توجد مطابقات كافية حاليًا",
    noMatchesDesc: "يُرجى محاولة إضافة المزيد من الاهتمامات أو تعديل خيارات ملفك الشخصي للتعرف على زملاء متوافقين.",
    compatibility: "توافق",
    sparkleAIType: "تحليل الذكاء الاصطناعي",
    compatibilityReason: "لماذا أنتما متوافقان؟",
    loadingCompatibility: "جاري تحليل التوافق عبر Gemini...",
    compatibilityFailed: "تعذر تحميل التحليل الذكي. تم الرجوع للتحليل التقليدي.",
    sendRequestBtn: "إرسال طلب اتصال",
    requestSent: "تم إرسال الطلب",
    connected: "متصل",

    // Connections Tab
    pendingRequests: "طلبات الاتصال الواردة",
    acceptBtn: "قبول",
    declineBtn: "رفض",
    myConnections: "زملائي المتصلين",
    noConnectionsYet: "لا توجد اتصالات نشطة حتى الآن",
    noConnectionsDesc: "ابحث عن زملاء دراسة متوافقين وأرسل لهم طلب اتصال للبدء في الدردشة.",

    // Chats Tab
    noChatsYet: "لا توجد محادثات نشطة",
    noChatsDesc: "عند قبول طلبات الاتصال، ستظهر غرف الدردشة هنا للتواصل والتعاون الدراسي.",
    typeMessagePlaceholder: "اكتب رسالة...",
    sendMsgBtn: "إرسال",

    // Profile Details
    editProfile: "تعديل الملف الشخصي",
    logout: "تسجيل الخروج",
    levelDisplay: "المستوى {level}",
    myBio: "النبذة التعريفية",
    myInterests: "الاهتمامات",
    myGoals: "الأهداف الأكاديمية",
    myPersonality: "الصفات الشخصية",
    myCommPref: "طريقة التواصل المفضلة",

    // Interest Importance Screen
    interestsImportanceTitle: "ما مدى أهمية هذه الاهتمامات؟",
    interestsImportanceDesc: "يساعدنا هذا في ترتيب المقترحات وعرض الطلاب الأكثر توافقاً معك.",
    importanceNormal: "عادي",
    importanceImportant: "مهم",
    importanceVeryImportant: "مهم جداً"
  },
  en: {
    // Welcome / Splash
    welcomeTitle: "Connect Smartly with Qassim University Peers",
    welcomeDesc: "Connect with Qassim University students who share your passion and academic interests.",
    next: "Next",
    continue: "Continue",
    continueEn: "Continue",

    // Language Selector
    selectLanguage: "Select Language",
    selectLanguageDesc: "Choose your preferred language",
    arabic: "العربية / Arabic",
    english: "English",

    // Login
    loginTitle: "Log In",
    loginDesc: "Enter your student ID to connect with peers",
    studentIdLabel: "Student ID or Email Address",
    studentIdPlaceholder: "4XXXXXXX or student@qu.edu.sa",
    passwordLabel: "Password (Optional)",
    passwordPlaceholder: "Enter your password",
    passwordTip: "💡 Leave password blank for instant passwordless quick login",
    loginBtn: "Log In",
    loggingIn: "Logging in...",
    errorEmptyId: "Please enter your student ID or email",
    errorBypassFail: "An error occurred during quick login",

    // Step 1: Profile Setup
    setupTitle: "Setup Your Profile",
    setupStep1: "Step 1 of 3",
    nameLabel: "First Name",
    namePlaceholder: "Enter your first name",
    collegeLabel: "College",
    collegeSelect: "Select College",
    majorLabel: "Major",
    majorSelect: "Select Major First",
    academicLevelLabel: "Academic Level",
    genderLabel: "Gender",
    genderMale: "Male Student",
    genderFemale: "Female Student",
    saving: "Saving...",

    // Step 2: Interests
    interestsTitle: "Choose Your Interests",
    interestsStep2: "Step 2 of 3",
    interestsDesc: "Choose at least 5 interests to help us find compatible peers.",
    skip: "Skip",
    selectedInterestsCount: "{count} interests selected",

    // Step 3: Goals & Bio
    goalsTitle: "Your Goals & Details",
    goalsStep3: "Step 3 of 3",
    goalsDesc: "What are you looking for in QU Connect? Choose your goals and write a brief bio.",
    goalsSection: "Connection Goals (Select multiple)",
    personalitySection: "Your Personality traits (Choose 3)",
    commPrefSection: "Preferred Communication Method",
    bioLabel: "Brief Bio",
    bioPlaceholder: "Write something about your academic interests or hobbies...",
    finishBtn: "Finish & Complete Profile",

    // Dashboard Tabs
    tabHome: "Home",
    tabConnections: "Connections",
    tabChats: "Chats",
    tabProfile: "Profile",
    tabAlerts: "Alerts",
    tabDiscover: "Discover",

    // Dashboard / Home Tab
    welcomeUser: "Welcome, {name}",
    haveMatches: "We found people you might match with",
    topMatches: "Top Matches",
    viewAll: "View All",
    noMatches: "No matches found yet",
    noMatchesDesc: "Try adding more interests or editing your profile options to connect with compatible peers.",
    compatibility: "Compatibility",
    sparkleAIType: "AI Compatibility Analysis",
    compatibilityReason: "Why are you a good match?",
    loadingCompatibility: "Analyzing compatibility via Gemini...",
    compatibilityFailed: "Failed to load AI summary. Fell back to traditional analysis.",
    sendRequestBtn: "Send Connection Request",
    requestSent: "Request Sent",
    connected: "Connected",

    // Connections Tab
    pendingRequests: "Incoming Requests",
    acceptBtn: "Accept",
    declineBtn: "Decline",
    myConnections: "My Connections",
    noConnectionsYet: "No active connections yet",
    noConnectionsDesc: "Find compatible study peers and send them a connection request to start chatting.",

    // Chats Tab
    noChatsYet: "No active chats",
    noChatsDesc: "Once connection requests are accepted, chat rooms will appear here for study collaboration.",
    typeMessagePlaceholder: "Type a message...",
    sendMsgBtn: "Send",

    // Profile Details
    editProfile: "Edit Profile",
    logout: "Log Out",
    levelDisplay: "Level {level}",
    myBio: "Bio",
    myInterests: "Interests",
    myGoals: "Academic Goals",
    myPersonality: "Personality",
    myCommPref: "Preferred Communication",

    // Interest Importance Screen
    interestsImportanceTitle: "How important are these interests?",
    interestsImportanceDesc: "This helps us suggest and display the most compatible peers.",
    importanceNormal: "Normal",
    importanceImportant: "Important",
    importanceVeryImportant: "Very Important"
  }
};
