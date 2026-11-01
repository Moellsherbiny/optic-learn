
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Lightbulb,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PreQuizRequiredProps {
  courseId: string;
  quizId: string;
  title: string;
}

const learningSteps = [
  {
    number: "01",
    title: "الاختبار القبلي",
    description: "اكتشف مستواك الحالي ومعرفتك السابقة.",
    icon: ClipboardCheck,
    status: "current",
  },
  {
    number: "02",
    title: "محتوى الكورس",
    description: "ابدأ التعلم واستكشف الدروس والأنشطة.",
    icon: BookOpen,
    status: "upcoming",
  },
  {
    number: "03",
    title: "الاختبار البعدي",
    description: "اكتشف مقدار تقدمك بعد إتمام المحتوى.",
    icon: CheckCircle2,
    status: "upcoming",
  },
] as const;

export function PreQuizRequired({
  courseId,
  quizId,
  title,
}: PreQuizRequiredProps) {
  return (
    <main
      dir="rtl"
      className="min-h-dvh bg-background text-foreground"
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border">
          <Link
            href={`/student/`}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            العودة إلى الرئيسية
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Optic Learn
            </span>
          </div>
        </header>

        {/* Main content */}
        <div className="grid flex-1 grid-cols-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-16">
          {/* Left: Introduction and learning journey */}
          <section className="flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              <span>رحلتك التعليمية تبدأ من هنا</span>
            </div>

            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.3]">
                لنتعرف على مستواك
                <span className="text-primary"> قبل أن نبدأ!</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                كل رحلة تعلم تبدأ من نقطة مختلفة. أجب عن الاختبار القبلي
                لنتعرف على معرفتك الحالية ونساعدك في الحصول على تجربة تعلم
                تناسب مستواك.
              </p>
            </div>

            {/* Course context */}
            <div className="mt-8 flex items-center gap-3 border-y border-border py-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <BookOpen className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  أنت على وشك البدء في
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-foreground sm:text-base">
                  {title}
                </p>
              </div>
            </div>

            {/* Learning journey */}
            <div className="mt-9">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">
                  مراحل رحلتك التعليمية
                </h2>
                <span className="text-xs text-muted-foreground">
                  3 مراحل
                </span>
              </div>

              <div className="space-y-0">
                {learningSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCurrent = step.status === "current";

                  return (
                    <div key={step.number} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                            isCurrent
                              ? "border-primary/20 bg-primary text-primary-foreground"
                              : "border-border bg-muted text-muted-foreground",
                          )}
                        >
                          <Icon className="size-4" />
                        </div>

                        {index !== learningSteps.length - 1 && (
                          <div className="my-1 min-h-8 w-px flex-1 bg-border" />
                        )}
                      </div>

                      <div className="min-w-0 pb-7">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              isCurrent
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {step.title}
                          </p>

                          {isCurrent && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              أنت هنا
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Right: Assessment panel */}
          <section className="flex h-full flex-col justify-center lg:border-s border-border lg:ps-12">
            <div className="mx-auto w-full max-w-lg lg:mx-0">
              <div className="mb-7">
                <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ClipboardCheck className="size-7" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  الخطوة الأولى
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  الاختبار القبلي
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  لا تقلق بشأن الإجابات الصحيحة أو الخاطئة. الهدف هو فهم
                  مستواك الحالي، وليس تقييمك أو الحكم على معرفتك.
                </p>
              </div>

              {/* Quiz details */}
              <div className="border-y border-border py-5">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  الاختبار المطلوب
                </p>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                    <ClipboardCheck className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold leading-relaxed text-foreground">
                      {title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      التقييم المبدئي لمستواك
                    </p>
                  </div>
                </div>
              </div>

              {/* Encouragement */}
              <div className="my-6 flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium text-foreground">
                    نصيحة قبل البدء
                  </p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    أجب بما تعرفه بالفعل. لا تحتاج إلى التحضير أو مراجعة
                    المحتوى مسبقًا.
                  </p>
                </div>
              </div>

              {/* Primary action */}
              <Button
                asChild
                size="lg"
                className="h-12 w-full gap-2 text-sm font-semibold"
              >
                <Link href={`/quizzes/${quizId}`}>
                  ابدأ الاختبار القبلي
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>

              <p className="mt-4 text-center text-xs leading-6 text-muted-foreground">
                بعد إتمام الاختبار، ستنتقل إلى محتوى الكورس وتبدأ
                رحلتك التعليمية.
              </p>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <PlayCircle className="size-4" />
                <span>خطوة واحدة تفصلك عن بداية التعلم</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="flex min-h-14 shrink-0 items-center justify-center border-t border-border py-3">
          <p className="text-center text-xs text-muted-foreground">
            تعلم بالسرعة التي تناسبك، وتقدم خطوة بخطوة.
          </p>
        </footer>
      </div>
    </main>
  );
}
