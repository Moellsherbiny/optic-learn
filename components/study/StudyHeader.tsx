
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import type {
  CourseWithProgress,
  ModuleWithProgress,
} from "@/types/study";
import { StudySidebar } from "./StudySidebar";

interface Props {
  course: CourseWithProgress;
  modules: ModuleWithProgress[];
}

export function StudyHeader({ course, modules }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const progress = Math.min(
    100,
    Math.max(0, course.progressPercent),
  );

  // Close the drawer with Escape and prevent background scrolling.
  useEffect(() => {
    if (!isSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <header className="z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-3 sm:px-5">
        {/* Mobile menu button / Back link */}
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open course navigation"
            aria-expanded={isSidebarOpen}
            aria-controls="mobile-study-sidebar"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            <Menu className="size-5" />
          </button>

          <Link
            href={`/courses/${course.id}`}
            className="group flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5" />
            <span className="hidden sm:inline">Back to Course</span>
          </Link>
        </div>

        {/* Course title */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:max-w-sm">
          <BookOpen className="size-4 shrink-0 text-primary" />
          <span className="truncate text-sm font-medium text-foreground">
            {course.title}
          </span>
        </div>

        {/* Course progress */}
        <div
          className="flex shrink-0 items-center gap-2 sm:gap-3"
          aria-label={`Course progress: ${progress}%`}
        >
          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <span className="font-semibold tabular-nums text-primary">
              {course.completedLessons}/{course.totalLessons}
            </span>
            <span>lessons</span>
          </div>

          <div
            className="h-1.5 w-14 overflow-hidden rounded-full bg-muted sm:w-24"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course progress"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="min-w-9 text-end text-xs tabular-nums text-muted-foreground">
            {progress}%
          </span>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close course navigation"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <aside
            id="mobile-study-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Course navigation"
            className="absolute inset-y-0 inset-s-0 flex w-[min(85vw,360px)] flex-col border-e border-border bg-sidebar shadow-2xl animate-in slide-in-from-left duration-200 rtl:slide-in-from-right"
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
              <div className="flex min-w-0 items-center gap-2">
                <BookOpen className="size-4 shrink-0 text-primary" />
                <span className="truncate text-sm font-semibold text-foreground">
                  Course Content
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close course navigation"
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <StudySidebar
                courseId={course.id}
                modules={modules}
                progressPercent={course.progressPercent}
                completedLessons={course.completedLessons}
                totalLessons={course.totalLessons}
                onLessonSelect={() => setIsSidebarOpen(false)}
              />
            </div>

            {progress === 100 && (
              <div className="flex shrink-0 items-center gap-2 border-t border-border p-4 text-sm text-primary">
                <CheckCircle2 className="size-4" />
                <span>Course completed</span>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
