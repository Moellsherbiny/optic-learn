"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Play,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { getStudentDashboardData } from "@/actions/student/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
export default function StudentDashboard() {
  const t = useTranslations("Student");
  const locale = useLocale();
  const { data: session, status } = useSession();
  const isArabic = locale.startsWith("ar");
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const fetchData = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasError(false);

    try {
      const result = await getStudentDashboardData(session.user.id);
      setData(result);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "loading") return;

    let cancelled = false;

    async function loadDashboard() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setHasError(false);

      try {
        const result = await getStudentDashboardData(session.user.id);

        if (!cancelled) {
          setData(result);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);

        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, status]);

  
  const course = data?.courses?.[0] ?? null;

  const latestLesson = data?.latestLesson;

 const completedLessons = Number(
  course?.completedLessons ?? 0
);

const totalLessons = Number(
  course?.totalLessons ?? 0
);

const courseProgress =
  totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;
  const lessonHref = latestLesson?.id
    ? `/${locale}courses/lessons/${latestLesson.id}`
    : course?.id
      ? `/${locale}/courses/${course.id}/study`
      : `/${locale}/student`;

  const courseHref = course?.id
    ? `/${locale}/courses/${course.id}/study`
    : `/${locale}/student`;

  const firstName =
    session?.user?.name?.trim().split(/\s+/)[0] ||
    (isArabic ? "بطل التعلم" : "Learner");

  if (loading || status === "loading") {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-48 animate-pulse rounded-3xl bg-muted" />

        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 rounded-2xl border border-border/60 bg-card"
            />
          ))}
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-muted/70" />
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card">
          <GraduationCap className="size-6 text-primary" />
        </div>

        <h2 className="text-xl font-semibold">
          {isArabic ? "سجّل الدخول للمتابعة" : "Sign in to continue"}
        </h2>

        <Button asChild className="rounded-xl">
          <Link href={`/${locale}/auth/login`}>
            {isArabic ? "تسجيل الدخول" : "Sign in"}
          </Link>
        </Button>
      </div>
    );
  }

  if (hasError || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <BookOpen className="size-6" />
        </div>

        <h2 className="text-xl font-semibold">
          {isArabic ? "تعذر تحميل لوحة التعلم" : "Couldn't load your dashboard"}
        </h2>

        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          {isArabic
            ? "حدثت مشكلة أثناء جلب بياناتك. حاول مرة أخرى."
            : "Something went wrong while loading your learning data. Please try again."}
        </p>

        <Button onClick={fetchData} className="rounded-xl">
          {isArabic ? "إعادة المحاولة" : "Try again"}
        </Button>
      </div>
    );
  }

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto w-full max-w-7xl space-y-8 p-4 pb-10 sm:p-6 lg:space-y-10 lg:p-8"
    >
      {/* Welcome section */}
      <section className="relative isolate overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-y-0 inset-e-0 w-2/3 bg-[radial-gradient(ellipse_at_75%_30%,var(--primary)_0%,transparent_65%)] opacity-[0.07]" />

          <div className="absolute -inset-e-32 -top-40 size-110 rounded-full border border-primary/8" />
          <div className="absolute -inset-e-16 -top-24 size-80 rounded-full border border-primary/8" />

          <div className="absolute -inset-e-20 -bottom-45 size-85 rounded-full bg-primary/5 blur-3xl" />

          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        </div>

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center lg:gap-12 lg:p-10">
          {/* Welcome content */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              {isArabic ? "مساحة التعلم الخاصة بك" : "YOUR LEARNING SPACE"}
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
              {isArabic ? "أهلًا، " : "Welcome back, "}
              <span className="text-primary">{firstName}</span>
              <span className="text-foreground">{isArabic ? "!" : "!"}</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              {course
                ? isArabic
                  ? "استمر في رحلتك التعليمية، كل درس تنهيه يقربك أكثر من هدفك. واصل التقدم!"
                  : "Your learning journey continues. Every lesson you complete brings you one step closer to your goal. Keep going!"
                : isArabic
                  ? "رحلتك التعليمية تبدأ من هنا. استعد لاكتساب المعرفة وتطوير مهاراتك خطوة بخطوة."
                  : "Your learning journey starts here. Get ready to build knowledge and develop your skills, one step at a time."}
            </p>

            {/* Course status */}
            {course && (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <GraduationCap className="size-4" />
                  </span>
                  <span>
                    {data.userLevel ?? (isArabic ? "المتعلم" : "Learner")}
                  </span>
                </div>

                <span className="h-4 w-px bg-border" />

                <div className="inline-flex items-center gap-2">
                  <BookOpen className="size-4 text-primary" />
                  <span className="max-w-45 truncate font-medium text-foreground">
                    {isArabic ? course.title : course.titleEn || course.title}
                  </span>
                </div>
              </div>
            )}

            {/* Primary action */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                asChild
                disabled={!course}
                className="h-11 gap-2 rounded-xl px-5 shadow-sm shadow-primary/10"
              >
                <Link href={lessonHref}>
                  {latestLesson
                    ? isArabic
                      ? "متابعة التعلم"
                      : "Continue learning"
                    : isArabic
                      ? "ابدأ التعلم"
                      : "Start learning"}
                  <DirectionArrow className="size-4" />
                </Link>
              </Button>

              {course && (
                <span className="text-xs text-muted-foreground">
                  {isArabic
                    ? "واصل من حيث توقفت"
                    : "Pick up where you left off"}
                </span>
              )}
            </div>
          </div>

          {/* Progress visualization */}
          <div className="relative mx-auto flex w-full max-w-65 items-center justify-center lg:mx-0 lg:justify-self-end">
            <div className="relative flex aspect-square w-full items-center justify-center">
              {/* Decorative rings */}
              <div className="absolute inset-1 rounded-full border border-dashed border-primary/20" />
              <div className="absolute inset-5 rounded-full border border-primary/10" />
              <div className="absolute inset-10 rounded-full bg-primary/[0.035]" />

              {/* Main progress card */}
              <div className="relative z-10 flex size-36 flex-col items-center justify-center rounded-[32px] border border-border/80 bg-background/90 shadow-lg shadow-primary/4 backdrop-blur-sm">
                <BookOpen
                  className="mb-2 size-7 text-primary"
                  strokeWidth={1.7}
                />

                <span className="text-4xl font-bold tracking-tight tabular-nums">
                  {courseProgress}%
                </span>

                <span className="mt-1 text-[11px] font-medium text-muted-foreground">
                  {isArabic ? "نسبة الإنجاز" : "Completed"}
                </span>
              </div>

              {/* Floating achievement icons */}
              <div className="absolute inset-e-3 top-7 z-20 flex size-11 items-center justify-center rounded-2xl border border-border bg-card shadow-md">
                <Target className="size-5 text-primary" />
              </div>

              <div className="absolute bottom-7 inset-s-3 z-20 flex size-11 items-center justify-center rounded-2xl border border-border bg-card shadow-md">
                <Trophy className="size-5 text-primary" />
              </div>

              {/* Small decorative dot */}
              <div className="absolute inset-e-12 bottom-3 size-2 rounded-full bg-primary/50" />
              <div className="absolute inset-s-10 top-5 size-1.5 rounded-full bg-primary/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Target}
          label={isArabic ? "نسبة إكمال الكورس" : "Course completion"}
          value={`${courseProgress}%`}
          note={
            isArabic ? "تقدمك في رحلتك التعليمية" : "Your learning progress"
          }
          index="01"
        />

        <StatCard
          icon={CheckCircle2}
          label={isArabic ? "الدروس المكتملة" : "Completed lessons"}
          value={completedLessons}
          note={isArabic ? "الدروس التي أنهيتها" : "Lessons you have completed"}
          index="02"
        />

        <StatCard
          icon={BookOpen}
          label={isArabic ? "إجمالي الدروس" : "Total lessons"}
          value={totalLessons}
          note={isArabic ? "عدد دروس الكورس" : "Lessons in your course"}
          index="03"
        />
      </section>

      {/* Continue learning */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow={
            isArabic ? "تابع من حيث توقفت" : "PICK UP WHERE YOU LEFT OFF"
          }
          title={t("continueLearning")}
          description={
            isArabic
              ? "خطوتك التالية في رحلتك التعليمية."
              : "Your next step in the learning journey."
          }
        />

        <Card className="overflow-hidden rounded-2xl border-border/80 bg-card py-0 shadow-sm">
          {latestLesson ? (
            <CardContent className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_200px] lg:items-center">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <Play className="ms-0.5 size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-primary">
                    {isArabic ? "آخر درس" : "RECENT LESSON"}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold leading-snug">
                    {latestLesson.title}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {[latestLesson.courseTitle, latestLesson.moduleTitle]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <Progress
                      value={Number(latestLesson.percentage ?? 0)}
                      className="h-1.5 flex-1"
                    />
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                      {Number(latestLesson.percentage ?? 0).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <Button asChild className="h-11 gap-2 rounded-xl">
                <Link href={lessonHref}>
                  {isArabic ? "استكمال الدرس" : "Resume lesson"}
                  <DirectionArrow className="size-4" />
                </Link>
              </Button>
            </CardContent>
          ) : (
            <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted">
                <BookOpen className="size-5 text-muted-foreground" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">
                  {isArabic
                    ? "ابدأ أول درس في الكورس"
                    : "Start your first lesson"}
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {isArabic
                    ? "ابدأ رحلتك التعليمية وتعرف على محتوى الكورس."
                    : "Begin your learning journey and explore the course content."}
                </p>
              </div>

              {course && (
                <Button asChild className="gap-2 rounded-xl">
                  <Link href={courseHref}>
                    {isArabic ? "ابدأ الآن" : "Get started"}
                    <DirectionArrow className="size-4" />
                  </Link>
                </Button>
              )}
            </CardContent>
          )}
        </Card>
      </section>

      {/* My course */}
      <section className="space-y-5">
        <SectionHeading
          eyebrow={isArabic ? "مسارك التعليمي" : "YOUR LEARNING PATH"}
          title={isArabic ? "الكورس الخاص بي" : "My Course"}
          description={
            isArabic
              ? "كل ما تحتاجه لمتابعة تقدمك وإكمال رحلتك التعليمية."
              : "Everything you need to track your progress and complete your learning journey."
          }
        />

        {course ? (
          <Card className="group overflow-hidden rounded-2xl border-border/80 bg-card py-0 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/4">
            <Link
              href={courseHref}
              className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
              aria-label={
                isArabic
                  ? `فتح كورس ${course.title}`
                  : `Open course ${course.title}`
              }
            >
              {/* Course thumbnail */}
              <div className="relative aspect-video overflow-hidden border-b border-border/60 bg-muted md:aspect-auto md:min-h-70 md:border-b-0 md:border-e">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-20 items-center justify-center rounded-3xl border border-border bg-background text-primary shadow-sm">
                      <BookOpen className="size-9" strokeWidth={1.5} />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent" />

                {courseProgress >= 100 && (
                  <Badge className="absolute inset-e-4 top-4 gap-1 rounded-lg border-0 bg-background/90 text-foreground shadow-sm backdrop-blur-sm">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    {isArabic ? "مكتمل" : "Completed"}
                  </Badge>
                )}
              </div>

              {/* Course details */}
              <CardContent className="flex flex-col justify-center gap-6 p-5 sm:p-7 lg:p-9">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs font-medium text-primary">
                    <GraduationCap className="size-4" />
                    {isArabic ? "الكورس التعليمي" : "YOUR COURSE"}
                  </div>

                  <h3 className="text-xl font-semibold leading-8 tracking-tight sm:text-2xl">
                    {isArabic ? course.title : course.titleEn || course.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {course.instructor ||
                      (isArabic ? "هيئة التدريس" : "Course instructor")}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {isArabic ? "التقدم في الكورس" : "Course progress"}
                    </span>

                    <span className="font-semibold tabular-nums">
                      {courseProgress}%
                    </span>
                  </div>

                  <Progress value={courseProgress} className="h-2" />

                  <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" />
                      {completedLessons}/{totalLessons} {t("Course.lessons")}
                    </span>

                    <span className="inline-flex items-center gap-1 font-medium text-primary transition-transform group-hover:-translate-x-0.5">
                      {isArabic ? "فتح الكورس" : "Open course"}
                      <DirectionArrow className="size-3.5" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ) : (
          <Card className="rounded-2xl border-dashed border-border bg-card shadow-none">
            <CardContent className="flex flex-col items-center px-6 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                <BookOpen className="size-6 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">
                {isArabic
                  ? "الكورس غير متاح حاليًا"
                  : "No course available yet"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {isArabic
                  ? "سيظهر الكورس هنا بمجرد تسجيلك فيه."
                  : "Your course will appear here once you are enrolled."}
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
        {eyebrow}
      </p>

      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>

      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  index,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number | string;
  note: string;
  index: string;
}) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border/80 bg-card py-0 shadow-sm transition-colors hover:border-primary/30">
      <CardContent className="relative flex items-start gap-4 p-5 sm:p-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
          <Icon className="size-5" strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium leading-5 text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            {note}
          </p>
        </div>

        <span className="text-[10px] font-medium tabular-nums text-muted-foreground/50">
          {index}
        </span>
      </CardContent>
    </Card>
  );
}
