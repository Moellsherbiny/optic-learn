import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  QuizType,
  QuestionType,
} from "../lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing. Add it to your .env file.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const courseTitle = "Computer Hardware Maintenance";

type QuizSeed = {
  title: string;
  description: string;
  quizType: QuizType;
  questions: {
    text: string;
    type: QuestionType;
    options: { text: string; isCorrect: boolean }[];
  }[];
};

const quizzes: QuizSeed[] = [
  {
    title: "الاختبار القبلي – صيانة مكونات الحاسب",
    description:
      "اختبار قبلي لقياس المعرفة الأساسية لدى الطالب قبل دراسة وحدات اللوحة الأم والمعالج والذاكرة ووحدات التخزين ومزود الطاقة.",
    quizType: QuizType.PREQUIZ,
    questions: [
      {
        text: "ما المكون الرئيسي الذي يربط أجزاء الحاسب ويوفر مسارات الاتصال بينها؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "اللوحة الأم (Motherboard)", isCorrect: true },
          { text: "القرص الصلب (HDD)", isCorrect: false },
          { text: "مزود الطاقة (PSU)", isCorrect: false },
          { text: "صندوق الحاسب (Case)", isCorrect: false },
        ],
      },
      {
        text: "ما الوظيفة الأساسية لوحدة المعالجة المركزية (CPU)؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "تخزين الملفات بصورة دائمة", isCorrect: false },
          { text: "تنفيذ التعليمات ومعالجة البيانات", isCorrect: true },
          { text: "تزويد جميع المكونات بالطاقة مباشرة", isCorrect: false },
          { text: "عرض الصورة على الشاشة فقط", isCorrect: false },
        ],
      },
      {
        text: "أي نوع من الذاكرة يفقد محتوياته عند انقطاع الكهرباء؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "HDD", isCorrect: false },
          { text: "ROM", isCorrect: false },
          { text: "RAM", isCorrect: true },
          { text: "SSD", isCorrect: false },
        ],
      },
      {
        text: "ما الواجهة الشائعة لتوصيل قرص HDD داخلي حديث بالحاسب؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "SATA", isCorrect: true },
          { text: "HDMI", isCorrect: false },
          { text: "VGA", isCorrect: false },
          { text: "Audio Jack", isCorrect: false },
        ],
      },
      {
        text: "ما وظيفة مزود الطاقة (PSU)؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "تحويل وتنظيم الطاقة لتناسب مكونات الحاسب", isCorrect: true },
          { text: "تنفيذ تعليمات البرامج", isCorrect: false },
          { text: "تخزين نظام التشغيل", isCorrect: false },
          { text: "تبريد المعالج فقط", isCorrect: false },
        ],
      },
      {
        text: "هل يجب فصل كابل الكهرباء قبل تركيب أو فك أحد المكونات الداخلية؟",
        type: QuestionType.TRUE_FALSE,
        options: [
          { text: "صحيح", isCorrect: true },
          { text: "خطأ", isCorrect: false },
        ],
      },
      {
        text: "هل يمكن تركيب أي معالج على أي لوحة أم دون مراعاة التوافق؟",
        type: QuestionType.TRUE_FALSE,
        options: [
          { text: "صحيح", isCorrect: false },
          { text: "خطأ", isCorrect: true },
        ],
      },
      {
        text: "هل تُستخدم ذاكرة RAM للاحتفاظ بالبيانات بشكل دائم بعد إيقاف التشغيل؟",
        type: QuestionType.TRUE_FALSE,
        options: [
          { text: "صحيح", isCorrect: false },
          { text: "خطأ", isCorrect: true },
        ],
      },
      {
        text: "هل يمكن أن يؤدي عدم توافق موصلات الطاقة أو تركيبها بصورة خاطئة إلى منع تشغيل الحاسب؟",
        type: QuestionType.TRUE_FALSE,
        options: [
          { text: "صحيح", isCorrect: true },
          { text: "خطأ", isCorrect: false },
        ],
      },
      {
        text: "هل يُنصح بفتح قرص HDD في مكان عادي لتنظيف الأجزاء الداخلية؟",
        type: QuestionType.TRUE_FALSE,
        options: [
          { text: "صحيح", isCorrect: false },
          { text: "خطأ", isCorrect: true },
        ],
      },
    ],
  },
  {
    title: "الاختبار التكويني – صيانة مكونات الحاسب",
    description:
      "اختبار تدريبي أثناء دراسة الكورس لقياس فهم وظائف المكونات وطرق التركيب والفحص والتعامل مع الأعطال الشائعة.",
    quizType: QuizType.NORMAL,
    questions: [
      {
        text: "أي جزء في اللوحة الأم يُستخدم لتركيب المعالج؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "CPU Socket", isCorrect: true },
          { text: "RAM Slot", isCorrect: false },
          { text: "SATA Connector", isCorrect: false },
          { text: "PCIe Slot", isCorrect: false },
        ],
      },
      {
        text: "ما وظيفة بطارية CMOS في اللوحة الأم؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "تشغيل المعالج أثناء انقطاع الكهرباء", isCorrect: false },
          { text: "المساعدة في الاحتفاظ بالساعة وبعض إعدادات BIOS/UEFI", isCorrect: true },
          { text: "زيادة سعة ذاكرة RAM", isCorrect: false },
          { text: "تخزين الملفات الشخصية", isCorrect: false },
        ],
      },
      {
        text: "ما العامل الأهم عند التأكد من توافق معالج مع لوحة أم؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "لون اللوحة الأم", isCorrect: false },
          { text: "نوع مقبس المعالج ودعم اللوحة له", isCorrect: true },
          { text: "حجم القرص الصلب", isCorrect: false },
          { text: "عدد منافذ الصوت فقط", isCorrect: false },
        ],
      },
      {
        text: "ما المقصود بتردد المعالج (Clock Speed)؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "معدل دورات تشغيل المعالج في الثانية", isCorrect: true },
          { text: "سعة القرص الصلب", isCorrect: false },
          { text: "عدد منافذ USB", isCorrect: false },
          { text: "كمية الطاقة المخزنة في البطارية", isCorrect: false },
        ],
      },
      {
        text: "ما الغرض من المعجون الحراري (Thermal Paste)؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "زيادة سرعة الذاكرة", isCorrect: false },
          { text: "تحسين انتقال الحرارة بين سطح المعالج والمشتت", isCorrect: true },
          { text: "تثبيت كابل SATA", isCorrect: false },
          { text: "عزل المعالج عن المشتت حراريًا", isCorrect: false },
        ],
      },
      {
        text: "أي مما يلي يُعد من أعراض مشكلة محتملة في ذاكرة RAM؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "إعادة تشغيل أو توقف مفاجئ وظهور أخطاء ذاكرة", isCorrect: true },
          { text: "انخفاض مساحة المكتب", isCorrect: false },
          { text: "تغير دقة الطابعة فقط", isCorrect: false },
          { text: "تعطل مكبرات الصوت دائمًا", isCorrect: false },
        ],
      },
      {
        text: "ما الفرق الأساسي بين HDD وRAM؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "كلاهما ذاكرة مؤقتة", isCorrect: false },
          { text: "HDD تخزين دائم نسبيًا، وRAM ذاكرة مؤقتة سريعة", isCorrect: true },
          { text: "RAM تخزن الملفات بعد فصل الكهرباء وHDD لا", isCorrect: false },
          { text: "لا يوجد أي اختلاف بينهما", isCorrect: false },
        ],
      },
      {
        text: "ما الأداة أو الإجراء المناسب مبدئيًا لفحص حالة قرص التخزين؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "قراءة بيانات SMART باستخدام أداة موثوقة", isCorrect: true },
          { text: "فتح القرص وإزالة الأطباق", isCorrect: false },
          { text: "تسخين القرص", isCorrect: false },
          { text: "فصل رأس القراءة يدويًا", isCorrect: false },
        ],
      },
      {
        text: "هل يجب التأكد من قدرة مزود الطاقة وموصلاته قبل استبداله أو تركيب مكونات جديدة؟",
        type: QuestionType.TRUE_FALSE,
        options: [
          { text: "صحيح", isCorrect: true },
          { text: "خطأ", isCorrect: false },
        ],
      },
      {
        text: "هل من الآمن فتح وحدة PSU بواسطة شخص غير مؤهل حتى بعد فصلها عن الكهرباء مباشرة؟",
        type: QuestionType.TRUE_FALSE,
        options: [
          { text: "صحيح", isCorrect: false },
          { text: "خطأ", isCorrect: true },
        ],
      },
    ],
  },
  {
    title: "الاختبار البعدي – صيانة مكونات الحاسب",
    description:
      "اختبار بعدي شامل لقياس نواتج تعلم الكورس في التعرف على مكونات الحاسب وتركيبها وفحصها وتشخيص أعطالها بأمان.",
    quizType: QuizType.POSTQUIZ,
    questions: [
      {
        text: "أي وصف يوضح الدور الأساسي للوحة الأم بصورة أدق؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "تربط المكونات وتوفر قنوات الاتصال والتوصيل بينها", isCorrect: true },
          { text: "تخزن جميع الملفات بصورة دائمة", isCorrect: false },
          { text: "تحول التيار المتردد إلى تيار مستمر وحدها", isCorrect: false },
          { text: "تعمل كمروحة تبريد رئيسية", isCorrect: false },
        ],
      },
      {
        text: "أي موصل يُستخدم عادةً لتوفير الطاقة الرئيسية للوحة الأم؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "ATX 24-pin", isCorrect: true },
          { text: "SATA Data", isCorrect: false },
          { text: "Front Audio", isCorrect: false },
          { text: "HDMI", isCorrect: false },
        ],
      },
      {
        text: "ما الترتيب الأنسب عند تركيب معالج جديد؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "فصل الطاقة، التحقق من التوافق، محاذاة المعالج مع المقبس، ثم تثبيته وتركيب التبريد", isCorrect: true },
          { text: "تشغيل الجهاز ثم الضغط على المعالج داخل المقبس", isCorrect: false },
          { text: "وضع المعجون الحراري داخل مقبس المعالج أولًا", isCorrect: false },
          { text: "توصيل المعالج بكابل SATA", isCorrect: false },
        ],
      },
      {
        text: "ما النتيجة المحتملة لارتفاع درجة حرارة المعالج بصورة مستمرة؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "خفض الأداء أو إيقاف الجهاز للحماية", isCorrect: true },
          { text: "زيادة سعة RAM تلقائيًا", isCorrect: false },
          { text: "تحويل HDD إلى SSD", isCorrect: false },
          { text: "زيادة عدد منافذ اللوحة الأم", isCorrect: false },
        ],
      },
      {
        text: "عند تركيب وحدة RAM، ما الإجراء الصحيح؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "محاذاة الشق الموجود بالوحدة مع الحاجز في المنفذ والضغط برفق حتى تثبت", isCorrect: true },
          { text: "تركيبها في منفذ SATA", isCorrect: false },
          { text: "إزالة الشق من الوحدة لتناسب المنفذ", isCorrect: false },
          { text: "الضغط عليها بالقوة دون مراجعة الاتجاه", isCorrect: false },
        ],
      },
      {
        text: "إذا لم يتعرف الحاسب على وحدة RAM بعد تركيبها، فما أول خطوة مناسبة؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "فصل الطاقة ثم إعادة تثبيت الوحدة والتحقق من المنفذ والتوافق", isCorrect: true },
          { text: "فتح مزود الطاقة", isCorrect: false },
          { text: "تهيئة القرص الصلب", isCorrect: false },
          { text: "تغيير كابل الشاشة فقط", isCorrect: false },
        ],
      },
      {
        text: "ما الإجراء الأكثر أمانًا عند الاشتباه في وجود عطل بقرص HDD يحتوي على بيانات مهمة؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "تقليل استخدام القرص وتجنب الكتابة أو التهيئة، وتأمين نسخة أو الاستعانة بمختص", isCorrect: true },
          { text: "تهيئة القرص فورًا", isCorrect: false },
          { text: "فتح القرص في مكان مكشوف", isCorrect: false },
          { text: "تشغيل اختبارات كتابة مكثفة دون نسخة احتياطية", isCorrect: false },
        ],
      },
      {
        text: "ما الوظيفة الأساسية لمزود الطاقة (PSU)؟",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          { text: "تحويل وتنظيم الطاقة الكهربائية وتوزيعها على مكونات الحاسب", isCorrect: true },
          { text: "تخزين نظام التشغيل", isCorrect: false },
          { text: "معالجة تعليمات البرامج", isCorrect: false },
          { text: "إدارة ملفات المستخدم", isCorrect: false },
        ],
      },
      {
        text: "هل ينبغي استخدام وسائل الحماية من الكهرباء الساكنة عند التعامل مع المكونات الداخلية؟",
        type: QuestionType.TRUE_FALSE,
        options: [
          { text: "صحيح", isCorrect: true },
          { text: "خطأ", isCorrect: false },
        ],
      },
      {
        text: "قد تحتفظ مكثفات مزود الطاقة بشحنة خطرة حتى بعد فصل كابل الكهرباء.",
        type: QuestionType.TRUE_FALSE,
        options: [
          { text: "صحيح", isCorrect: true },
          { text: "خطأ", isCorrect: false },
        ],
      },
    ],
  },
];

async function main() {
  const configuredCourseId = process.env.DEFAULT_COURSE_ID;

  const course = configuredCourseId
    ? await prisma.course.findUnique({
        where: { id: configuredCourseId },
        select: { id: true, title: true },
      })
    : await prisma.course.findFirst({
        where: { title: courseTitle },
        select: { id: true, title: true },
      });

  if (!course) {
    throw new Error(
      configuredCourseId
        ? `Course not found for DEFAULT_COURSE_ID=${configuredCourseId}`
        : `Course "${courseTitle}" was not found. Set DEFAULT_COURSE_ID in .env or run the course seed first.`,
    );
  }

  let createdQuizzes = 0;
  let skippedQuizzes = 0;

  for (const quizData of quizzes) {
    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        courseId: course.id,
        title: quizData.title,
        quizType: quizData.quizType,
      },
      select: { id: true },
    });

    // Skip existing quizzes to avoid replacing questions after students may have attempted them.
    if (existingQuiz) {
      skippedQuizzes++;
      console.log(`Skipped existing quiz: ${quizData.title}`);
      continue;
    }

    await prisma.quiz.create({
      data: {
        title: quizData.title,
        description: quizData.description,
        quizType: quizData.quizType,
        courseId: course.id,
        questions: {
          create: quizData.questions.map((question) => ({
            text: question.text,
            type: question.type,
            options: {
              create: question.options,
            },
          })),
        },
      },
    });

    createdQuizzes++;
    console.log(`Created quiz: ${quizData.title}`);
  }

  console.log("Quiz seed completed.");
  console.log({
    courseId: course.id,
    courseTitle: course.title,
    createdQuizzes,
    skippedQuizzes,
    totalQuizDefinitions: quizzes.length,
    totalQuestions: quizzes.reduce(
      (total, quiz) => total + quiz.questions.length,
      0,
    ),
  });
}

main()
  .catch((error) => {
    console.error("Quiz seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
