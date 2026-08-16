export interface Student {
  id: string;
  studentId: string;
  displayName: string;
  gender: 'male' | 'female';
  college: string;
  major: string;
  level: number; // 1 to 10
  interests: string[];
  goals: string[];
  personality: string[];
  communicationPref: string;
  bio: string;
  avatar: string;
  compatibility?: number; // matching percentage
  sparkleText?: string; // Sparkle contextual matching text
}

export const COLLEGES = [
  {
    id: 'cc',
    name: 'كلية الحاسب',
    majors: ['علوم الحاسب', 'هندسة الحاسب', 'تقنية المعلومات', 'الأمن السيبراني']
  },
  {
    id: 'coeng',
    name: 'كلية الهندسة',
    majors: ['هندسة كهربائية', 'هندسة ميكانيكية', 'هندسة مدنية', 'هندسة كيميائية']
  },
  {
    id: 'csci',
    name: 'كلية العلوم',
    majors: ['رياضيات', 'فيزياء', 'كيمياء', 'علم الأحياء']
  },
  {
    id: 'cba',
    name: 'كلية إدارة الأعمال',
    majors: ['محاسبة', 'تمويل وبنوك', 'إدارة أعمال', 'تسويق', 'نظم معلومات إدارية']
  },
  {
    id: 'cmed',
    name: 'كلية الطب البشري',
    majors: ['الطب والجراحة']
  }
];

export const CATEGORIZED_INTERESTS = [
  {
    category: 'التقنية',
    items: ['الذكاء الاصطناعي', 'برمجة وتطوير', 'أمن سيبراني', 'تصميم واجهات']
  },
  {
    category: 'الترفيه',
    items: ['الأنمي', 'ألعاب الفيديو', 'أفلام ومسلسلات', 'موسيقى']
  },
  {
    category: 'الرياضة',
    items: ['كرة القدم', 'كرة السلة', 'بادل', 'لياقة بدنية']
  },
  {
    category: 'الإبداع والفنون',
    items: ['التصوير', 'التصميم الجرافيكي', 'الرسم', 'كتابة إبداعية']
  },
  {
    category: 'المجتمع والتطوع',
    items: ['التطوع', 'ريادة الأعمال', 'الأندية الطلابية', 'النقاشات العامة']
  }
];

export const GOALS = [
  { id: 'study', name: 'شريك مذاكرة', desc: 'البحث عن طلاب للمذاكرة المشتركة وتبادل الملاحظات.', icon: '📚' },
  { id: 'friends', name: 'أصدقاء جدد', desc: 'التعرف على أشخاص يشاركونك نفس الاهتمامات.', icon: '🤝' },
  { id: 'guidance', name: 'توجيه وإرشاد', desc: 'التواصل مع طلاب في مستويات متقدمة للاستفادة من خبراتهم.', icon: '💡' },
  { id: 'activities', name: 'أنشطة وفعاليات', desc: 'المشاركة في الأندية الطلابية والفعاليات الجامعية.', icon: '🏆' }
];

export const PERSONALITY_PILLS = [
  'اجتماعي', 'هادئ', 'طموح', 'مبدع', 'تحليلي', 'متعاون'
];

export const COMMUNICATION_PREF_RADIO = [
  'لقاءات دراسية', 'محادثات نصية', 'فعاليات جماعية'
];

export const MOCK_STUDENTS: Student[] = [
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
