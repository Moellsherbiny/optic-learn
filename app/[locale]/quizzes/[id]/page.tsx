
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
import type { LucideIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { getQuizForAttempt } from "@/actions/student/quiz";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function QuizIntroPage({ params }: Props) {
  const { id } = await params;

  const [quiz, locale, t] = await Promise.all([
    getQuizForAttempt(id).catch(() => null),
    getLocale(),
    getTranslations("QuizIntro"),
  ]);

  if (!quiz) notFound();

  const isRTL = locale === "ar";
  const dir = isRTL ? "rtl" : "ltr";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const ForwardIcon = isRTL ? ArrowLeft : ArrowRight;

  const alreadyAttempted = quiz.quizAttempts.length > 0;
  const attempt = quiz.quizAttempts[0];

  const questionCount = quiz.questions.length;
  const estimatedMinutes = Math.ceil(questionCount * 1.5);
  const score = alreadyAttempted ? attempt.score : null;

  const quizRules = [
    {
      title: t("rules.singleAttempt.title"),
      description: t("rules.singleAttempt.description"),
    },
    {
      title: t("rules.correctAnswer.title"),
      description: t("rules.correctAnswer.description"),
    },
    {
      title: t("rules.review.title"),
      description: t("rules.review.description"),
    },
    {
      title: t("rules.progress.title"),
      description: t("rules.progress.description"),
    },
  ];

  return (
    <main
      dir={dir}
      className="min-h-dvh bg-background text-foreground"
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        {/* Top navigation */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border">
          <Link
            href="/student/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <BackIcon className="size-4" />
            {t("dashboard")}
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-4" />
            </div>

            <span className="text-sm font-bold">
              Optic Learn
            </span>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 items-start gap-10 py-8 lg:grid-cols-[1fr_340px] lg:gap-14 lg:py-12">
          {/* Main content */}
          <section className="min-w-0">
            {/* Breadcrumb */}
            <nav
              aria-label={t("breadcrumb")}
              className="mb-8 flex min-w-0 items-center gap-2 text-xs text-muted-foreground"
            >
              <Link
                href="/student/dashboard"
                className="shrink-0 transition-colors hover:text-foreground"
              >
                {t("courses")}
              </Link>

              <ForwardIcon className="size-3 shrink-0" />

              <span className="truncate">
                {quiz.course.title}
              </span>
            </nav>

            {/* Quiz introduction */}
            <div className="mb-10">
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen className="size-7" />
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {t("quizBadge")}
                </span>

                {alreadyAttempted && (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {t("completedBadge")}
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
                  {t("defaultDescription")}
                </p>
              )}
            </div>

            {/* Quiz statistics */}
            <section
              aria-label={t("quizInformation")}
              className="mb-10"
            >
              <h2 className="mb-4 text-sm font-semibold">
                {t("overview")}
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard
                  icon={BookOpen}
                  label={t("statistics.questions")}
                  value={questionCount.toString()}
                  detail={t("statistics.questionUnit")}
                />

                <StatCard
                  icon={Clock3}
                  label={t("statistics.estimatedTime")}
                  value={estimatedMinutes.toString()}
                  detail={t("statistics.minutes")}
                />

                <StatCard
                  icon={BarChart3}
                  label={t("statistics.yourScore")}
                  value={score !== null ? `${score}%` : "—"}
                  detail={
                    alreadyAttempted
                      ? t("statistics.achievedScore")
                      : t("statistics.notStarted")
                  }
                  className="col-span-2 sm:col-span-1"
                />
              </div>
            </section>

            {/* Instructions */}
            <section>
              <div className="mb-5">
                <h2 className="text-lg font-semibold">
                  {t("beforeStarting")}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {t("beforeStartingDescription")}
                </p>
              </div>

              <div className="divide-y divide-border border-y border-border">
                {quizRules.map((rule, index) => (
                  <div
                    key={index}
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
                    {t("completedTitle")}
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    {t("completedHeading")}
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {t("completedDescription")}
                  </p>

                  <div className="my-6 rounded-xl bg-muted/50 p-5 text-center">
                    <p className="text-xs text-muted-foreground">
                      {t("finalScore")}
                    </p>

                    <p className="mt-2 text-4xl font-bold tabular-nums text-foreground">
                      {attempt.score}%
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="h-11 w-full"
                  >
                    <Link
                      href={`/student/quizzes/results/${attempt.id}`}
                    >
                      <RotateCcw className="me-2 size-4" />
                      {t("reviewAnswers")}
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Target className="size-6" />
                  </div>

                  <p className="text-xs font-semibold text-primary">
                    {t("readyTitle")}
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    {t("readyHeading")}
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {t("readyDescription")}
                  </p>

                  <div className="my-6 space-y-3 rounded-xl bg-muted/50 p-4">
                    <InfoRow
                      icon={ListChecks}
                      label={t("actionInfo.questions")}
                      value={t("actionInfo.questionCount", {
                        count: questionCount,
                      })}
                    />

                    <InfoRow
                      icon={Clock3}
                      label={t("actionInfo.estimatedTime")}
                      value={t("actionInfo.minuteCount", {
                        count: estimatedMinutes,
                      })}
                    />

                    <InfoRow
                      icon={Award}
                      label={t("actionInfo.attempts")}
                      value={t("actionInfo.singleAttempt")}
                    />
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className="h-12 w-full"
                  >
                    <Link href={`/quizzes/${id}/attempt`}>
                      {t("startQuiz")}
                      <ForwardIcon className="ms-auto size-4" />
                    </Link>
                  </Button>

                  <p className="mt-4 text-center text-xs leading-6 text-muted-foreground">
                    {t("goodLuck")}
                  </p>
                </>
              )}
            </div>

            {!alreadyAttempted && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />

                <p className="text-xs leading-6 text-muted-foreground">
                  {t("tip")}
                </p>
              </div>
            )}
          </aside>
        </div>

        {/* Footer */}
        <footer className="flex min-h-14 items-center justify-center border-t border-border py-3">
          <p className="text-center text-xs text-muted-foreground">
            {t("footer")}
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
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {label}
        </span>

        <Icon className="size-4 text-primary" />
      </div>

      <p className="text-2xl font-bold tabular-nums text-foreground">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span>{label}</span>
      </div>

      <span className="font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}
