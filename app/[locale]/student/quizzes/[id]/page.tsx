
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Target,
} from "lucide-react";

import { getQuizForAttempt } from "@/actions/student/quiz";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

const quizRules = [
  {
    title: "محاولة واحدة",
    description: "يمكنك أداء هذا الاختبار مرة واحدة فقط.",
  },
  {
    title: "اختر الإجابة الصحيحة",
    description: "يحتوي كل سؤال على إجابة صحيحة واحدة.",
  },
  {
    title: "راجع إجاباتك",
    description: "يمكنك مراجعة إجاباتك بعد تسليم الاختبار.",
  },
  {
    title: "تابع تقدمك",
    description: "تُضاف نتيجتك إلى لوحة المتصدرين.",
  },
];

export default async function QuizIntroPage({ params }: Props) {
  const { id } = await params;

  const quiz = await getQuizForAttempt(id).catch(() => null);

  if (!quiz) notFound();

  const alreadyAttempted = quiz.quizAttempts.length > 0;
  const attempt = quiz.quizAttempts[0];

  const questionCount = quiz.questions.length;
  const estimatedMinutes = Math.ceil(questionCount * 1.5);
  const score = alreadyAttempted ? attempt.score : null;

  return (
    <main
      dir="rtl"
      className="min-h-dvh bg-background text-foreground"
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        {/* Top navigation */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="size-4" />
            لوحة التحكم
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-4" />
            </div>
            <span className="text-sm font-bold">Optic Learn</span>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 items-start gap-10 py-8 lg:grid-cols-[1fr_340px] lg:gap-14 lg:py-12">
          {/* Main content */}
          <section className="min-w-0">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex min-w-0 items-center gap-2 text-xs text-muted-foreground"
            >
              <Link
                href="/student/dashboard"
                className="shrink-0 transition-colors hover:text-foreground"
              >
                الكورسات
              </Link>

              <ArrowLeft className="size-3 shrink-0" />

              <span className="truncate">{quiz.course.title}</span>
            </nav>

            {/* Quiz introduction */}
            <div className="mb-10">
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen className="size-7" />
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  اختبار تعليمي
                </span>

                {alreadyAttempted && (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    تم إكمال الاختبار
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {quiz.title}
              </h1>

              {quiz.description ? (
                <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                  {quiz.description}
                </p>
              ) : (
                <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                  استعد لاختبار معلوماتك واكتشف مستوى فهمك للمحتوى
                  التعليمي.
                </p>
              )}
            </div>

            {/* Quiz statistics */}
            <section aria-label="Quiz information" className="mb-10">
              <h2 className="mb-4 text-sm font-semibold">
                نظرة عامة على الاختبار
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard
                  icon={BookOpen}
                  label="عدد الأسئلة"
                  value={questionCount.toString()}
                  detail="سؤال"
                />

                <StatCard
                  icon={Clock3}
                  label="الوقت المتوقع"
                  value={estimatedMinutes.toString()}
                  detail="دقيقة تقريباً"
                />

                <StatCard
                  icon={BarChart3}
                  label="نتيجتك"
                  value={score !== null ? `${score}%` : "—"}
                  detail={alreadyAttempted ? "النتيجة المحققة" : "لم تبدأ بعد"}
                  className="col-span-2 sm:col-span-1"
                />
              </div>
            </section>

            {/* Instructions */}
            <section>
              <div className="mb-5">
                <h2 className="text-lg font-semibold">
                  قبل أن تبدأ
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  إليك بعض المعلومات المهمة قبل أداء الاختبار.
                </p>
              </div>

              <div className="divide-y divide-border border-y border-border">
                {quizRules.map((rule, index) => (
                  <div
                    key={rule.title}
                    className="flex items-start gap-3 py-4"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <CheckCircle2 className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {rule.title}
                      </p>
                      <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>

          {/* Right action panel */}
          <aside className="lg:sticky lg:top-8">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              {alreadyAttempted ? (
                <>
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Award className="size-6" />
                  </div>

                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    الاختبار مكتمل
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    أحسنت! لقد أنهيت الاختبار.
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    يمكنك الآن مراجعة إجاباتك والاطلاع على نتيجتك.
                  </p>

                  <div className="my-6 rounded-xl bg-muted/50 p-5 text-center">
                    <p className="text-xs text-muted-foreground">
                      نتيجتك النهائية
                    </p>
                    <p className="mt-2 text-4xl font-bold tabular-nums text-foreground">
                      {attempt.score}%
                    </p>
                  </div>

                  <Button asChild variant="outline" className="h-11 w-full">
                    <Link href={`/student/quizzes/results/${attempt.id}`}>
                      <RotateCcw className="ms-2 size-4" />
                      مراجعة الإجابات
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Target className="size-6" />
                  </div>

                  <p className="text-xs font-semibold text-primary">
                    جاهز للبدء؟
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    حان وقت اختبار معلوماتك!
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    خذ وقتك في قراءة الأسئلة واختر الإجابة التي تراها
                    صحيحة.
                  </p>

                  <div className="my-6 space-y-3 rounded-xl bg-muted/50 p-4">
                    <InfoRow
                      icon={ListChecks}
                      label="الأسئلة"
                      value={`${questionCount} سؤال`}
                    />
                    <InfoRow
                      icon={Clock3}
                      label="الوقت المتوقع"
                      value={`${estimatedMinutes} دقيقة`}
                    />
                    <InfoRow
                      icon={Award}
                      label="عدد المحاولات"
                      value="مرة واحدة"
                    />
                  </div>

                  <Button asChild size="lg" className="h-12 w-full">
                    <Link href={`/quizzes/${id}/attempt`}>
                      ابدأ الاختبار
                      <ArrowLeft className="me-auto size-4" />
                    </Link>
                  </Button>

                  <p className="mt-4 text-center text-xs leading-6 text-muted-foreground">
                    بالتوفيق! أنت قادر على تحقيق أفضل نتيجة.
                  </p>
                </>
              )}
            </div>

            {!alreadyAttempted && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs leading-6 text-muted-foreground">
                  اقرأ كل سؤال بعناية قبل اختيار إجابتك. يمكنك مراجعة
                  إجاباتك بعد تسليم الاختبار.
                </p>
              </div>
            )}
          </aside>
        </div>

        {/* Footer */}
        <footer className="flex min-h-14 items-center justify-center border-t border-border py-3">
          <p className="text-center text-xs text-muted-foreground">
            Optic Learn · تعلم وتقدم بالسرعة التي تناسبك.
          </p>
        </footer>
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="size-4 text-primary" />
      </div>

      <p className="text-2xl font-bold tabular-nums text-foreground">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span>{label}</span>
      </div>

      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
