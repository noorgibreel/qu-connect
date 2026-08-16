import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const { user, candidate } = await request.json();

    if (!user || !candidate) {
      return NextResponse.json(
        { error: 'Missing user or candidate profile data' },
        { status: 400 }
      );
    }

    const prompt = `أنت مساعد ذكاء اصطناعي متخصص في تقييم وتحليل التوافق الأكاديمي والاهتمامات المشتركة بين طلاب جامعة القصيم (QU Connect).
مهمتك هي صياغة شرح قصير باللغة العربية يشرح سبب توافق هذين الطالبين وتوضيح نقاط التوافق بينهما.

قواعد مهمة:
1. يجب أن تكون الصياغة مهنية وأكاديمية ومحترمة (غير رومانسية تماماً، حيث أن التطبيق مصمم للبحث عن زملاء دراسة وأصدقاء في الجامعة).
2. ركز على الاهتمامات المشتركة والأهداف المشتركة (مثال: شريك مذاكرة، أنشطة طلابية) والتشابه في الكلية أو التخصص.
3. التزم باللغة العربية الفصحى المبسطة بأسلوب ودود ومهني.

بيانات الطالبين:
الطالب الأول (المستخدم الحالي):
- الاسم: ${user.displayName}
- الكلية: ${user.college}
- التخصص: ${user.major}
- المستوى الأكاديمي: ${user.level}
- الاهتمامات: ${user.interests?.join('، ') || 'لا يوجد'}
- الأهداف: ${user.goals?.join('، ') || 'لا يوجد'}

الطالب الثاني (المرشح للمطابقة):
- الاسم: ${candidate.displayName}
- الكلية: ${candidate.college}
- التخصص: ${candidate.major}
- المستوى الأكاديمي: ${candidate.level}
- الاهتمامات: ${candidate.interests?.join('، ') || 'لا يوجد'}
- الأهداف: ${candidate.goals?.join('، ') || 'لا يوجد'}

المخرجات المطلوبة:
يجب أن ترجع النتيجة كصيغة JSON صالحة تحتوي على حقلين:
1. "explanation": نص عربي قصير جداً (فقرة واحدة، 2-3 جمل كحد أقصى) تلخص سبب التوافق. مثال: "لديكما اهتمامات مشتركة في البرمجة والذكاء الاصطناعي، وكلاكما يبحث عن شريك مذاكرة. كما أنكما تدرسان في نفس الكلية."
2. "points": مصفوفة تحتوي على 1 إلى 3 نقاط توافق رئيسية قصيرة (كل نقطة جملة واحدة قصيرة). مثال: ["كلاكما مهتم بالبرمجة والذكاء الاصطناعي", "كلاكما يبحث عن شريك مذاكرة"]

تأكد من إرجاع JSON صالح فقط، بدون أي علامات ترميز (markdown \`\`\`json) أو نصوص إضافية.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Gemini API call failed:', errText);
      return NextResponse.json(
        { error: 'Failed to fetch compatibility explanation from Gemini API' },
        { status: res.status }
      );
    }

    const resData = await res.json();
    const textOutput = resData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      return NextResponse.json(
        { error: 'Empty output from Gemini model' },
        { status: 500 }
      );
    }

    const parsedOutput = JSON.parse(textOutput);
    return NextResponse.json(parsedOutput);

  } catch (error: any) {
    console.error('Error in compatibility API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
