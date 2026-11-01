
"use client";

import { useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  Loader2,
  SendHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { submitQuizAttempt } from "@/actions/student/quiz";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Quiz = NonNullable<
  Awaited<
    ReturnType<
      typeof import("@/actions/student/quiz").getQuizForAttempt
    >
  >
>;

interface Props {
  quiz: Quiz;
}

export function QuizAttemptClient({ quiz }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("QuizAttempt");

  const isRTL = locale === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const questions = quiz.questions;
  const questionCount = questions.length;
  const question = questions[current];

  const totalAnswered = Object.keys(answers).length;
  const unanswered = questionCount - totalAnswered;

  const currentProgress =
    questionCount > 0
      ? Math.round(((current + 1) / questionCount) * 100)
      : 0;

  const isLast = current === questionCount - 1;
  const allAnswered = totalAnswered === questionCount;

  function selectOption(questionId: string, optionId: string) {
    if (submitting) return;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionId,
    }));
  }

  function goToQuestion(index: number) {
    if (submitting || index < 0 || index >= questionCount) return;
    setCurrent(index);
  }

  async function handleSubmit() {
    if (submitting) return;

    if (!allAnswered) {
      toast.warning(
        t("unansweredWarning", { count: unanswered })
      );
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitQuizAttempt({
        quizId: quiz.id,
        answers,
      });

      router.replace(
        `/quizzes/results/${result.attemptId}`
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : t("submitError");

      toast.error(message);
      setSubmitting(false);
    }
  }

  // Empty quiz state
  if (questionCount === 0) {
    return (
      <main
        dir={dir}
        className="flex min-h-dvh items-center justify-center bg-background px-4"
      >
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <ClipboardCheck className="size-8" />
          </div>

          <h1 className="text-xl font-bold text-foreground">
            {t("emptyTitle")}
          </h1>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {t("emptyDescription")}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      dir={dir}
      className="flex min-h-dvh flex-col bg-background text-foreground"
    >
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex min-h-16 items-center justify-between gap-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardCheck className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {quiz.title}
                </p>

                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {quiz.course.title}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-end">
              <p className="text-sm font-semibold tabular-nums">
                {t("questionOf", {
                  current: current + 1,
                  total: questionCount,
                })}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("question")}
              </p>
            </div>
          </div>

          <div className="pb-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {t("answered")}:{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {totalAnswered}/{questionCount}
                </span>
              </span>

              <span className="font-semibold tabular-nums text-primary">
                {currentProgress}%
              </span>
            </div>

            <Progress
              value={currentProgress}
              className="h-1.5"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          {/* Question section */}
          <section className="min-w-0">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-primary">
                  {t("questionNumber", {
                    number: current + 1,
                  })}
                </p>

                <h1 className="mt-1 text-lg font-semibold sm:text-xl">
                  {t("instructions")}
                </h1>
              </div>

              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium",
                  answers[question.id]
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {answers[question.id]
                  ? t("answeredStatus")
                  : t("pendingStatus")}
              </span>
            </div>

            {/* Question card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
              <div className="mb-7">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {current + 1}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {t("totalQuestions", {
                      total: questionCount,
                    })}
                  </span>
                </div>

                <h2 className="text-xl font-semibold leading-relaxed tracking-tight sm:text-2xl">
                  {question.text}
                </h2>

                <p className="mt-3 text-xs text-muted-foreground">
                  {t("selectHint")}
                </p>
              </div>

              {/* Options */}
              <div
                role="radiogroup"
                aria-label={question.text}
                className="space-y-3"
              >
                {question.options.map((option, index) => {
                  const selected =
                    answers[question.id] === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={submitting}
                      onClick={() =>
                        selectOption(question.id, option.id)
                      }
                      className={cn(
                        "group flex w-full items-center gap-4 rounded-xl border p-4 text-start transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                        selected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-muted/50 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary"
                        )}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span
                        className={cn(
                          "min-w-0 flex-1 text-sm leading-7",
                          selected
                            ? "font-semibold text-foreground"
                            : "text-foreground/80"
                        )}
                      >
                        {option.text}
                      </span>

                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-transparent"
                        )}
                      >
                        {selected && (
                          <Check className="size-3.5" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => goToQuestion(current - 1)}
                disabled={current === 0 || submitting}
                className="gap-2"
              >
                {isRTL ? (
                  <ArrowRight className="size-4" />
                ) : (
                  <ArrowLeft className="size-4" />
                )}

                {t("previous")}
              </Button>

              {isLast ? (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !allAnswered}
                  className="gap-2"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="size-4" />
                  )}

                  {submitting
                    ? t("submitting")
                    : t("submit")}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => goToQuestion(current + 1)}
                  disabled={submitting}
                  className="gap-2"
                >
                  {t("next")}

                  {isRTL ? (
                    <ArrowLeft className="size-4" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                </Button>
              )}
            </div>

            {isLast && !allAnswered && (
              <div
                role="status"
                className="mt-4 flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400"
              >
                <AlertCircle className="size-4" />

                <span>
                  {t("unansweredCount", {
                    count: unanswered,
                  })}
                </span>
              </div>
            )}
          </section>

          {/* Question navigator */}
          <aside className="min-w-0 lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-5">
                <h2 className="text-sm font-semibold">
                  {t("navigatorTitle")}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {t("navigatorDescription")}
                </p>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-5">
                {questions.map((item, index) => {
                  const isCurrent = index === current;
                  const isAnswered = Boolean(answers[item.id]);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goToQuestion(index)}
                      disabled={submitting}
                      aria-label={t("questionNumber", {
                        number: index + 1,
                      })}
                      aria-current={
                        isCurrent ? "step" : undefined
                      }
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-lg border text-xs font-semibold tabular-nums transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                        isCurrent
                          ? "border-primary bg-primary text-primary-foreground"
                          : isAnswered
                            ? "border-primary/20 bg-primary/10 text-primary hover:bg-primary/15"
                            : "border-border bg-background text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 space-y-3 border-t border-border pt-5">
                <Legend
                  icon={
                    <span className="size-2.5 rounded-sm bg-primary" />
                  }
                  label={t("legendCurrent")}
                />

                <Legend
                  icon={
                    <span className="size-2.5 rounded-sm bg-primary/40" />
                  }
                  label={t("legendAnswered")}
                />

                <Legend
                  icon={
                    <span className="size-2.5 rounded-sm bg-muted-foreground/30" />
                  }
                  label={t("legendUnanswered")}
                />
              </div>

              {/* Answer progress */}
              <div className="mt-5 rounded-xl bg-muted/50 p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {t("answered")}
                  </span>

                  <span className="font-semibold tabular-nums">
                    {totalAnswered}/{questionCount}
                  </span>
                </div>

                <Progress
                  value={(totalAnswered / questionCount) * 100}
                  className="h-1.5"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Submission footer */}
      <footer className="sticky bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground">
              {t("answeredSummary", {
                answered: totalAnswered,
                total: questionCount,
              })}
            </p>

            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {allAnswered
                ? t("reviewHint")
                : t("completeAllHint")}
            </p>
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !allAnswered}
            size="lg"
            className="shrink-0 gap-2"
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SendHorizontal className="size-4" />
            )}

            <span className="hidden sm:inline">
              {submitting ? t("submitting") : t("finish")}
            </span>

            <span className="sm:hidden">
              {submitting ? "..." : t("submit")}
            </span>
          </Button>
        </div>
      </footer>
    </main>
  );
}

function Legend({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <span className="text-xs text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
