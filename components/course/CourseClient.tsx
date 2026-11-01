
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpLeft,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Layers3,
  Search,
  SearchX,
  Users,
} from "lucide-react";
import type { getAllCourses } from "@/actions/courses";

type Courses = Awaited<ReturnType<typeof getAllCourses>>;

type CoursesClientProps = {
  courses: Courses;
  locale: string;
};

export default function CoursesClient({
  courses,
  locale,
}: CoursesClientProps) {
  const [search, setSearch] = useState("");

  const isArabic = locale === "ar";
  const isRTL = isArabic;

  const text = {
    eyebrow: isArabic ? "مساحة التعلّم" : "LEARNING SPACE",
    title: isArabic ? "صيانة الحاسب الآلي" : "Computer Maintenance",
    subtitle: isArabic
      ? "كل ما تحتاجه لفهم مكونات الحاسب، وتشخيص الأعطال، واكتساب مهارات الصيانة العملية."
      : "Explore computer components, diagnose problems, and build practical maintenance skills.",
    catalog: isArabic ? "المحتوى التعليمي" : "COURSE LIBRARY",
    catalogTitle: isArabic ? "رحلتك تبدأ من هنا" : "Your learning journey starts here",
    search: isArabic ? "ابحث عن كورس..." : "Search courses...",
    allCourses: isArabic ? "الكورسات المتاحة" : "Available courses",
    modules: isArabic ? "وحدة تعليمية" : "modules",
    lessons: isArabic ? "درس" : "lessons",
    students: isArabic ? "طالب" : "students",
    instructor: isArabic ? "المحاضر" : "Instructor",
    start: isArabic ? "ابدأ التعلّم" : "Start learning",
    continue: isArabic ? "متابعة التعلّم" : "Continue learning",
    emptyTitle: isArabic ? "مفيش نتائج مطابقة" : "No matching courses",
    emptyDescription: isArabic
      ? "جرّب كلمة بحث مختلفة."
      : "Try searching with a different keyword.",
    clear: isArabic ? "مسح البحث" : "Clear search",
    noCourses: isArabic
      ? "الكورسات هتظهر هنا بمجرد إضافتها."
      : "Courses will appear here once they are added.",
    overview: isArabic ? "نظرة عامة" : "OVERVIEW",
    subject: isArabic ? "المادة التعليمية" : "SUBJECT",
  };

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(
      isArabic ? "ar" : "en",
    );

    if (!query) return courses;

    return courses.filter((course) => {
      const title = course.title?.toLocaleLowerCase(
        isArabic ? "ar" : "en",
      ) ?? "";

      const description =
        course.description?.toLocaleLowerCase(
          isArabic ? "ar" : "en",
        ) ?? "";

      const teacher = course.teacher?.name?.toLocaleLowerCase(
        isArabic ? "ar" : "en",
      ) ?? "";

      return (
        title.includes(query) ||
        description.includes(query) ||
        teacher.includes(query)
      );
    });
  }, [courses, search, isArabic]);

  const totalModules = courses.reduce(
    (total, course) => total + course._count.modules,
    0,
  );

  const totalLessons = courses.reduce(
    (total, course) => total + course.totalLessons,
    0,
  );

  const totalStudents = courses.reduce(
    (total, course) => total + course._count.enrollments,
    0,
  );

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="mx-auto w-full max-w-7xl space-y-9 px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      {/* Page introduction */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold tracking-wide text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {text.eyebrow}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {text.title}
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
              {text.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm">
                <BookOpen className="size-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {courses.length}
                </span>
                <span className="text-muted-foreground">
                  {text.allCourses}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm">
                <Layers3 className="size-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {totalModules}
                </span>
                <span className="text-muted-foreground">
                  {text.modules}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <div className="flex size-44 items-center justify-center rounded-full border border-border bg-muted/50">
              <div className="flex size-32 items-center justify-center rounded-full border border-primary/20 bg-background">
                <GraduationCap className="size-16 text-primary" strokeWidth={1.25} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real statistics */}
      <section
        aria-label={text.overview}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        <StatCard
          icon={BookOpen}
          label={text.allCourses}
          value={courses.length}
        />
        <StatCard
          icon={Layers3}
          label={text.lessons}
          value={totalLessons}
        />
        <StatCard
          icon={Users}
          label={text.students}
          value={totalStudents}
        />
      </section>

      {/* Search and section heading */}
      <section className="space-y-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary">
              {text.catalog}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {text.catalogTitle}
            </h2>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <Search
              className={`absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground ${
                isRTL ? "right-4" : "left-4"
              }`}
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={text.search}
              aria-label={text.search}
              className={`h-12 w-full rounded-xl border border-border bg-card text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20 ${
                isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
              }`}
            />
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course, index) => {
              const courseHref =
                `/${locale}/student/courses/${course.id}`;

              return (
                <article
                  key={course.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-foreground/[0.04]"
                >
                  {/* Course cover */}
                  <Link
                    href={courseHref}
                    aria-label={course.title}
                    className="relative block aspect-[16/9] overflow-hidden bg-muted"
                  >
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <BookOpen
                          className="size-14 text-muted-foreground/50"
                          strokeWidth={1}
                        />
                      </div>
                    )}

                    <span className="absolute right-3 top-3 rounded-lg border border-border/70 bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground">
                      {isArabic
                        ? `كورس ${index + 1}`
                        : `Course ${index + 1}`}
                    </span>
                  </Link>

                  {/* Course information */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <GraduationCap className="size-4 text-primary" />
                      <span>{text.subject}</span>
                    </div>

                    <h3 className="text-lg font-bold leading-8 text-foreground transition-colors group-hover:text-primary">
                      <Link href={courseHref}>
                        {course.title}
                      </Link>
                    </h3>

                    <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-7 text-muted-foreground">
                      {course.description ||
                        (isArabic
                          ? "اكتشف محتوى الكورس وتعرّف على الدروس والوحدات التعليمية."
                          : "Explore the course content, lessons, and learning modules.")}
                    </p>

                    {/* Instructor */}
                    <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                        {course.teacher?.image ? (
                          <img
                            src={course.teacher.image}
                            alt={course.teacher.name ?? ""}
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        ) : (
                          <GraduationCap className="size-4 text-muted-foreground" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">
                          {text.instructor}
                        </p>
                        <p className="truncate text-sm font-medium text-foreground">
                          {course.teacher?.name ||
                            (isArabic
                              ? "فريق التدريس"
                              : "Teaching team")}
                        </p>
                      </div>
                    </div>

                    {/* Course stats */}
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <MiniStat
                        icon={Layers3}
                        value={course._count.modules}
                        label={text.modules}
                      />
                      <MiniStat
                        icon={BookOpen}
                        value={course.totalLessons}
                        label={text.lessons}
                      />
                      <MiniStat
                        icon={Users}
                        value={course._count.enrollments}
                        label={text.students}
                      />
                    </div>

                    {/* Learning action — no enrollment button */}
                    <Link
                      href={courseHref}
                      className="mt-5 flex min-h-11 items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      <span>{text.start}</span>
                      {isRTL ? (
                        <ArrowUpLeft className="size-4" />
                      ) : (
                        <ArrowUpRight className="size-4" />
                      )}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
              <SearchX className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-foreground">
              {courses.length === 0
                ? text.catalogTitle
                : text.emptyTitle}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
              {courses.length === 0
                ? text.noCourses
                : text.emptyDescription}
            </p>

            {search && courses.length > 0 && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {text.clear}
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
        <Icon className="size-5" />
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-muted/60 px-2 py-3 text-center">
      <Icon className="mx-auto size-4 text-muted-foreground" />
      <p className="mt-2 truncate text-sm font-bold tabular-nums text-foreground">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 truncate text-[10px] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
