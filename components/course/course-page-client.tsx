"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { enrollInCourse } from "@/actions/courses";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  Layers,
  CheckCircle2,
  PlayCircle,
  FileText,
  Paperclip,
  Lock,
  Loader2,
  BookOpen,
  Monitor,
  Calendar,
  ArrowRight,
} from "lucide-react";


type Lesson = {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT" | "MATERIAL" | "AR_MODEL";
  order: number;
  completed: boolean;
};

type Module = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  teacherName: string;
  teacherImage: string | null;
  teacherEmail: string | null;
  enrollmentCount: number;
  isEnrolled: boolean;
  createdAt: string;
  modules: Module[];
};

function lessonIcon(type: Lesson["type"]) {
  if (type === "VIDEO")
    return <PlayCircle size={16} className="text-primary shrink-0" />;
  if (type === "TEXT")
    return <FileText size={16} className="text-zinc-400 shrink-0" />;
  return <Paperclip size={16} className="text-zinc-400 shrink-0" />;
}

function progressPercent(modules: Module[]) {
  let total = 0;
  let done = 0;
  modules.forEach((m) =>
    m.lessons.forEach((l) => {
      total++;
      if (l.completed) done++;
    }),
  );
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ModuleItem({
  mod,
  isEnrolled,
  locale,
  courseId,
  defaultOpen,
}: {
  mod: Module;
  isEnrolled: boolean;
  locale: string;
  courseId: string;
  defaultOpen?: boolean;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(defaultOpen ?? false);
  const completedCount = mod.lessons.filter((l) => l.completed).length;
  const total = mod.lessons.length;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/mod">
      <CollapsibleTrigger
        className={cn(
          "w-full flex items-center gap-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4",
          "text-start transition-all duration-200 hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
      >
        <span className="shrink-0 w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-black flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
          {mod.order}
        </span>

        <div className="flex-1 min-w-0">
          <span className="text-[12px] font-medium text-zinc-400">
            {t("courses.lessons", {
              completed: completedCount,
              total,
            })}

            {isEnrolled && completedCount > 0 && ` • ${t("courses.done")}`}
          </span>
        </div>

        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-zinc-400 transition-transform duration-300",
            open && "rotate-180 text-primary",
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
        <div className="mt-2 mx-4 ps-6 border-s-2 border-zinc-100 dark:border-zinc-800 flex flex-col gap-1 pb-4 pt-2">
          {mod.description && (
            <p className="text-sm text-zinc-500 mb-4 ps-2">{mod.description}</p>
          )}
          {mod.lessons.map((lesson) => (
            <div key={lesson.id}>
              {isEnrolled ? (
                <Link
                  href={`/${locale}/courses/${courseId}/lessons/${lesson.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all group/item",
                    "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                  )}
                >
                  {lesson.completed ? (
                    <div className="bg-emerald-500/10 p-1 rounded-full">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                  ) : (
                    lessonIcon(lesson.type)
                  )}
                  <span
                    className={cn(
                      "flex-1 truncate text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-white",
                      lesson.completed && "opacity-50 font-normal",
                    )}
                  >
                    {lesson.title}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-zinc-300 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all"
                  />
                </Link>
              ) : (
                <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 opacity-60">
                  <Lock size={14} className="shrink-0" />
                  <span className="truncate">{lesson.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function CourseDetailClient({
  course,
  userId,
}: {
  course: Course;
  userId: string | null;
}) {
  const locale = useLocale();
  const t = useTranslations("courses");
  const router = useRouter();

  const isRtl = locale === "ar";

  const [isPending, startTransition] = useTransition();

  const pct = progressPercent(course.modules);

  const totalLessons = course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0,
  );

  const BackIcon = isRtl ? ChevronRight : ChevronLeft;

  const handleEnroll = () => {
    if (!userId) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    startTransition(async () => {
      await enrollInCourse(course.id);
      router.refresh();
    });
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <Link
            href={`/${locale}/courses`}
            className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
          >
            <BackIcon
              size={16}
              className="transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
            />
            {t("backToCourses")}
          </Link>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6">
          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Course Information */}
            <div className="min-w-0 flex-1 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  <Monitor size={14} />
                  {t("dept")}
                </div>

                <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
                  {course.title}
                </h1>

                {course.description && (
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Course Statistics */}
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
                    <Users size={16} className="text-primary" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-black text-foreground">
                      {course.enrollmentCount}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t("students")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
                    <Layers size={16} className="text-primary" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-black text-foreground">
                      {course.modules.length}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t("modules")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
                    <BookOpen size={16} className="text-primary" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-black text-foreground">
                      {totalLessons}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t("lessons", {
                        completed: 0,
                        total: totalLessons,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
                    <Calendar size={16} className="text-primary" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-black text-foreground">
                      {formatDate(course.createdAt, locale)}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t("createdAtLabel")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex w-fit items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <Avatar className="h-12 w-12 border-2 border-background">
                  <AvatarImage src={course.teacherImage ?? undefined} />

                  <AvatarFallback className="bg-muted text-sm font-black text-foreground">
                    {course.teacherName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-primary">
                    {t("instructor")}
                  </p>

                  <p className="text-base font-bold text-foreground">
                    {course.teacherName}
                  </p>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="w-full shrink-0 lg:w-80 xl:w-96">
              <div className="sticky top-24 overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl">
                {/* Course Thumbnail */}
                <div className="relative aspect-video w-full">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 400px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                      <Monitor size={60} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {!course.isEnrolled && (
                    <Badge className="absolute bottom-4 start-4 border-0 bg-background font-black text-foreground">
                      {t("limitedSeats")}
                    </Badge>
                  )}
                </div>

                <div className="space-y-6 p-6 sm:p-8">
                  {course.isEnrolled ? (
                    <div className="space-y-6">
                      {/* Progress */}
                      <div className="space-y-3">
                        <div className="flex items-end justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                            {t("yourProgress")}
                          </span>

                          <span className="text-2xl font-black text-primary">
                            {pct}%
                          </span>
                        </div>

                        <Progress
                          value={pct}
                          className="h-2.5 bg-muted"
                        />
                      </div>

                      <Button
                        asChild
                        size="lg"
                        className="h-14 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
                      >
                        <Link href={`/${locale}/courses/${course.id}/study`}>
                          {pct > 0
                            ? t("continueLearning")
                            : t("startLearning")}

                          <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        size="lg"
                        className="h-14 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
                        onClick={handleEnroll}
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : userId ? (
                          t("enrollNow")
                        ) : (
                          t("signInToEnroll")
                        )}
                      </Button>

                      <p className="text-center text-sm font-medium text-muted-foreground">
                        {t("freeEnrollment")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Curriculum */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              {t("curriculum")}
            </h2>

            <p className="font-medium text-muted-foreground">
              {t("curriculumDescription")}
            </p>
          </div>

          <div className="grid gap-4">
            {course.modules.map((mod, idx) => (
              <ModuleItem
                key={mod.id}
                mod={mod}
                isEnrolled={course.isEnrolled}
                locale={locale}
                courseId={course.id}
                defaultOpen={idx === 0}
              />
            ))}

            {course.modules.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border py-20">
                <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />

                <p className="text-lg font-bold text-muted-foreground">
                  {t("noModules")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}