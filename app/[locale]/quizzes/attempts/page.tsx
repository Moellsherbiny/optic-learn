
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Trophy,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

interface QuizAttemptsPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function QuizAttemptsPage({
  params,
}: QuizAttemptsPageProps) {
  const { locale } = await params
  const isArabic = locale === "ar"

  const [session, t] = await Promise.all([
    auth(),
    getTranslations("QuizAttempts"),
  ])

  if (!session?.user?.id) {
    redirect(`/${locale}/login`)
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      studentId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      score: true,
      createdAt: true,
      quiz: {
        select: {
          title: true,
        },
      },
    },
  })

  const BackIcon = isArabic ? ArrowRight : ArrowLeft
  const ForwardIcon = isArabic ? ChevronLeft : ChevronRight

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)

  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
            attempts.length
        )
      : 0

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/student`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <BackIcon className="size-4" />
            {t("backToDashboard")}
          </Link>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ClipboardList className="size-6" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t("title")}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                {t("description")}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
              <BookOpen className="size-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("totalAttempts")}
                </p>
                <p className="text-lg font-bold tabular-nums">
                  {attempts.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("totalAttempts")}
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums">
                  {attempts.length}
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardList className="size-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("averageScore")}
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums">
                  {averageScore}%
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Trophy className="size-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Attempts list */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">
                {t("historyTitle")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("historyDescription")}
              </p>
            </div>

            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {attempts.length}
            </span>
          </div>

          {attempts.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <ClipboardList className="size-7" />
              </div>

              <h3 className="text-lg font-semibold">
                {t("emptyTitle")}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {t("emptyDescription")}
              </p>

              <Link
                href={`/${locale}/student/courses`}
                className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t("browseCourses")}
                <ForwardIcon className="size-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="divide-y divide-border">
                {attempts.map((attempt, index) => {
                  const score = Math.min(
                    100,
                    Math.max(0, Math.round(attempt.score))
                  )

                  return (
                    <Link
                      key={attempt.id}
                      href={`/${locale}/quizzes/results/${attempt.id}`}
                      className="group flex flex-col gap-4 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                          <BookOpen className="size-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-semibold">
                              {attempt.quiz.title}
                            </h3>

                            {index === 0 && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                {t("latest")}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="size-3.5" />
                              {formatDate(attempt.createdAt)}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 className="size-3.5" />
                              {t("completed")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className="min-w-28">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-xs text-muted-foreground">
                              {t("score")}
                            </span>

                            <span className="text-sm font-bold tabular-nums">
                              {score}%
                            </span>
                          </div>

                          <div
                            className="h-1.5 overflow-hidden rounded-full bg-muted"
                            role="progressbar"
                            aria-label={t("score")}
                            aria-valuenow={score}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>

                        <ForwardIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:text-foreground" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
