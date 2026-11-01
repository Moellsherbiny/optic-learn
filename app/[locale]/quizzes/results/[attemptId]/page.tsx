
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Sparkles,
} from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

interface QuizResultsPageProps {
  params: Promise<{
    locale: string
    attemptId: string
  }>
}

export default async function QuizResultsPage({
  params,
}: QuizResultsPageProps) {
  const { attemptId, locale } = await params

  const [session, t] = await Promise.all([
    auth(),
    getTranslations("QuizResults"),
  ])

  if (!session?.user?.id) {
    redirect(`/${locale}/login`)
  }

  const attempt = await prisma.quizAttempt.findFirst({
    where: {
      id: attemptId,
      studentId: session.user.id,
    },
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          courseId: true,
          questions: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })

  if (!attempt) {
    notFound()
  }

  // Assumes score is stored as a percentage (0–100).
  const score = Math.min(100, Math.max(0, Math.round(attempt.score)))
  const totalQuestions = attempt.quiz.questions.length

  const isArabic = locale === "ar"
  const BackIcon = isArabic ? ArrowRight : ArrowLeft

  const formattedDate = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-EG" : "en-US",
    {
      dateStyle: "long",
      timeStyle: "short",
    }
  ).format(new Date(attempt.createdAt))

  const circumference = 2 * Math.PI * 70
  const progressOffset = circumference - (score / 100) * circumference

  const courseHref = `/${locale}/courses/${attempt.quiz.courseId}/study`

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Back navigation */}
        <Link
          href={courseHref}
          className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BackIcon className="size-4" />
          {t("backToCourse")}
        </Link>

        {/* Result overview */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -end-32 -top-40 size-96 rounded-full bg-primary/[0.06] blur-3xl" />
            <div className="absolute -start-24 -bottom-40 size-80 rounded-full bg-primary/[0.04] blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>

          <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_280px] lg:items-center">
            {/* Result text */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                {t("completedBadge")}
              </div>

              <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Award className="size-7" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t("title")}
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                {t("description")}
              </p>

              <div className="mt-7 w-full max-w-md rounded-2xl border border-border bg-background/80 p-4 text-start">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <BookOpen className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("quizLabel")}
                    </p>
                    <p className="mt-1 truncate font-semibold">
                      {attempt.quiz.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground lg:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  {formattedDate}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="size-4" />
                  {t("questionCount", { count: totalQuestions })}
                </span>
              </div>
            </div>

            {/* Score circle */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex size-56 items-center justify-center">
                <svg
                  viewBox="0 0 160 160"
                  className="-rotate-90 size-full"
                  aria-hidden="true"
                >
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="9"
                    className="text-muted"
                  />

                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    className="text-primary transition-all duration-1000"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-bold tracking-tight tabular-nums">
                    {score}
                    <span className="text-2xl text-muted-foreground">%</span>
                  </span>
                  <span className="mt-2 text-sm font-medium text-muted-foreground">
                    {t("scoreLabel")}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <CheckCircle2 className="size-4" />
                {t("submitted")}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold">
              {t("summaryTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("summaryDescription")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryCard
              icon={<Award className="size-5" />}
              label={t("scoreLabel")}
              value={`${score}%`}
              description={t("scoreDescription")}
            />

            <SummaryCard
              icon={<BookOpen className="size-5" />}
              label={t("totalQuestions")}
              value={totalQuestions.toString()}
              description={t("questionsDescription")}
            />
          </div>
        </section>

        {/* Actions */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-semibold">
            {t("nextStepTitle")}
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {t("nextStepDescription")}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={courseHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <BookOpen className="size-4" />
              {t("backToCourse")}
            </Link>

            <Link
              href="/student"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t("dashboard")}
              <BackIcon className="size-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode
  label: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">
            {value}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  )
}
