# QU Connect 🎓 (تواصل جامعة القصيم)

**QU Connect** هو تطبيق ويب تفاعلي ذكي مصمم لربط طلاب وطالبات جامعة القصيم بناءً على اهتماماتهم المشتركة، تخصصاتهم الأكاديمية، وأهدافهم الدراسية لتسهيل التعاون، المذاكرة المشتركة، والأنشطة الجامعية.

**QU Connect** is a smart interactive web platform designed to connect Qassim University students based on their mutual academic interests, majors, and study goals to facilitate learning collaboration, study partnerships, and student club activities.

---

## 🚀 المميزات الرئيسية (Core Features)

* **دعم كامل وثنائي اللغة (Full Bilingual Support)**:
  * تبديل فوري بين اللغتين العربية والإنجليزية بلمسة واحدة.
  * ضبط تلقائي لاتجاه الواجهات بالكامل (RTL للمحاذاة العربية و LTR للمحاذاة الإنجليزية).
* **نظام تهيئة تفاعلي (Interactive Onboarding Flow)**:
  * تحديد الكلية والتخصص والمستوى الدراسي.
  * اختيار الاهتمامات (التقنية، الرياضة، الفنون، الترفيه، المجتمع).
  * تحديد الأهمية النسبية لكل اهتمام (عادي، مهم، مهم جداً) لتحسين دقة الترشيحات.
  * تحديد الأهداف الأكاديمية (شريك مذاكرة، أصدقاء جدد، توجيه وإرشاد، أنشطة وفعاليات).
* **خوارزمية التوافق الذكية (Smart Compatibility Algorithm)**:
  * حساب نسبة التوافق بين الطلاب تلقائياً بناءً على الاهتمامات المشتركة وأوزان الأهمية.
  * دعم الحساب السريع المباشر للحسابات التجريبية (Demo Accounts) لتجنب أي تعليق بسبب بطء شبكة قاعدة البيانات.
  * إمكانية التحليل الذكي وتوضيح أسباب التوافق باستخدام الذكاء الاصطناعي (Gemini API Integration).
* **نظام محادثات وتنبيهات متكامل (Chats & Notifications)**:
  * إرسال واستقبال طلبات التواصل وقبولها أو رفضها.
  * غرف محادثات فورية (Live Chats) مع مؤشر الكتابة (Typing Indicator) ورسائل ترحيبية ذكية.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

* **الواجهة الأساسية والمنطق (Core Framework)**: [Next.js](https://nextjs.org/) (App Router) & [TypeScript](https://www.typescriptlang.org/).
* **قاعدة البيانات والمصادقة (Backend & Auth)**: [Supabase](https://supabase.com/).
* **الذكاء الاصطناعي (AI Analysis)**: [Gemini API](https://ai.google.dev/) (عبر مسار API مخصص للتوافق).
* **التصميم والواجهات (Styling)**: Vanilla CSS & Tailwind CSS (متوافق مع التصميم الراقي والهوية البصرية الراقية باللون الأخضر الداكن لجامعة القصيم).

---

## 📦 هيكلية قاعدة البيانات (Database Schema)

يحتوي المشروع على ملف [`schema.sql`](file:///c:/Users/User/Desktop/qu-connect/schema.sql) الذي يحتوي على كامل التداول والـ Triggers والسياسات الأمنية (RLS). أهم الجداول هي:
1. `profiles`: البيانات الأساسية للطالب (الكلية، التخصص، الجنس، النبذة).
2. `user_interests`: الاهتمامات المحددة مع وزن أهميتها (عادي `0` / مهم `1` / مهم جداً `2`).
3. `user_goals`: الأهداف الأكاديمية للطالب.
4. `connections`: طلبات التواصل وحالاتها (`pending`, `accepted`, `rejected`).
5. `messages`: سجل الرسائل داخل المحادثات.

---

## 💻 التشغيل المحلي (Local Setup)

### 1. المتطلبات الأساسية
تأكد من تثبيت [Node.js](https://nodejs.org/) (الإصدار 18 أو أحدث).

### 2. تثبيت الحزم (Install Dependencies)
```bash
npm install
```

### 3. إعداد البيئة (Environment Variables)
قم بإنشاء ملف `.env.local` في الجذر وإضافة بيانات Supabase و Gemini:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. تشغيل خادم التطوير (Run Dev Server)
```bash
npm run dev
```
افتح الرابط [http://localhost:3000](http://localhost:3000) في المتصفح.

---

## 📝 رخصة المشروع (License)
هذا المشروع مخصص للأغراض التعليمية والتطبيقية لطلاب جامعة القصيم.
This project is dedicated for educational and developmental purposes at Qassim University.
