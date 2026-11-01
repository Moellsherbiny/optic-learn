
"use client";
import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  FileText,
  Layers,
  Loader2,
  Paperclip,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { toggleLessonProgress } from "@/actions/study";
import { LessonType } from "@/types/study";

import type {
  LessonWithProgress,
  ModuleWithProgress,
  CourseWithProgress,
} from "@/types/study";

import { VideoLesson } from "./VideoLesson";
import { TextLesson } from "./TextLesson";
import { MaterialLesson } from "./MaterialLesson";
const ARLesson = dynamic(
  () => import("./ARLesson"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading AR experience...
        </p>
      </div>
    ),
  }
);

interface Props {
  lesson: LessonWithProgress;
  module: ModuleWithProgress | null;
  course: CourseWithProgress;
  modules: ModuleWithProgress[];
  nextLesson: LessonWithProgress | null;
  prevLesson: LessonWithProgress | null;
}

const lessonTypeConfig = {
  [LessonType.VIDEO]: {
    label: "Video lesson",
    icon: PlayCircle,
  },
  [LessonType.TEXT]: {
    label: "Reading lesson",
    icon: FileText,
  },
  [LessonType.MATERIAL]: {
    label: "Learning material",
    icon: Paperclip,
  },
  [LessonType.AR_MODEL]: {
    label: "Interactive 3D lesson",
    icon: Layers,
  },
};

export function LessonView({
  lesson,
  module,
  course,
  nextLesson,
  prevLesson,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [completionState, setCompletionState] = useState<{
    lessonId: string;
    completed: boolean;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Keep optimistic state scoped to the current lesson.
  const isCompleted =
    completionState?.lessonId === lesson.id
      ? completionState.completed
      : lesson.isCompleted;

  const progress = Math.min(
    100,
    Math.max(0, course.progressPercent),
  );

  const lessonConfig = lessonTypeConfig[lesson.type];
  const LessonIcon = lessonConfig?.icon ?? BookOpen;

  function handleToggleComplete() {
    if (isPending) return;

    const newValue = !isCompleted;

    setCompletionState({
      lessonId: lesson.id,
      completed: newValue,
    });

    setError(null);

    startTransition(async () => {
      const result = await toggleLessonProgress(
        lesson.id,
        course.id,
        newValue,
      );

      if (!result.success) {
        setCompletionState({
          lessonId: lesson.id,
          completed: !newValue,
        });

        setError(result.error);
        return;
      }

      if (
        newValue &&
        result.data.courseCompleted &&
        result.data.postQuizId
      ) {
        router.push(
          `/courses/${course.id}/quizzes/${result.data.postQuizId}`,
        );
        return;
      }

      // Refresh server-rendered progress and sidebar data.
      router.refresh();
    });
  }

  function navigateTo(targetLesson: LessonWithProgress) {
    router.push(
      `/courses/${course.id}/study/${targetLesson.id}`,
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Main lesson area */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex min-w-0 items-center gap-2 overflow-hidden text-xs text-muted-foreground sm:mb-8"
        >
          <span className="flex shrink-0 items-center gap-1.5">
            <BookOpen className="size-3.5" />
            <span className="max-w-32 truncate sm:max-w-48">
              {course.title}
            </span>
          </span>

          {module && (
            <>
              <span aria-hidden="true" className="text-muted-foreground/50">
                /
              </span>

              <span className="min-w-0 truncate">
                {module.title}
              </span>
            </>
          )}
        </nav>

        {/* Lesson heading */}
        <section className="mb-7 sm:mb-9">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <LessonIcon className="size-3.5 text-primary" />
              {lessonConfig?.label ?? "Lesson"}
            </span>

            {isCompleted && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Completed
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {lesson.title}
          </h1>

          {module && (
            <p className="mt-3 text-sm text-muted-foreground">
              {module.title}
            </p>
          )}
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive"
          >
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Lesson content */}
        <section
          aria-label="Lesson content"
          className="min-w-0"
        >
          {lesson.type === LessonType.VIDEO && (
            <VideoLesson lesson={lesson} />
          )}

          {lesson.type === LessonType.TEXT && (
            <TextLesson lesson={lesson} />
          )}

          {lesson.type === LessonType.MATERIAL && (
            <MaterialLesson lesson={lesson} />
          )}

          {lesson.type === LessonType.AR_MODEL && (
            <ARLesson lesson={lesson} />
          )}
        </section>

        {/* Completion section */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-4 sm:mt-10 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-primary/10 text-primary",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <Sparkles className="size-5" />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-foreground sm:text-base">
                  {isCompleted
                    ? "You've completed this lesson"
                    : "Finished this lesson?"}
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {isCompleted
                    ? "You can mark it as incomplete if you want to review it again."
                    : "Mark this lesson as complete to keep track of your learning progress."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleComplete}
              disabled={isPending}
              aria-pressed={isCompleted}
              className={cn(
                "inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
                isCompleted
                  ? "border border-border bg-background text-muted-foreground hover:bg-muted"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isCompleted ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Circle className="size-4" />
              )}

              {isPending
                ? "Saving..."
                : isCompleted
                  ? "Mark as incomplete"
                  : "Mark as complete"}
            </button>
          </div>
        </section>
      </main>

      {/* Lesson navigation */}
      <footer className="sticky bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          {/* Previous lesson */}
          <button
            type="button"
            onClick={() => prevLesson && navigateTo(prevLesson)}
            disabled={!prevLesson}
            className={cn(
              "flex min-w-0 max-w-[42%] items-center gap-2 rounded-xl px-3 py-2.5 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-30",
              prevLesson
                ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                : "text-muted-foreground",
            )}
          >
            <ArrowLeft className="size-4 shrink-0 rtl:rotate-180" />

            <span className="min-w-0">
              <span className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Previous
              </span>

              <span className="mt-0.5 hidden max-w-36 truncate text-xs font-semibold sm:block">
                {prevLesson?.title ?? "Previous lesson"}
              </span>
            </span>
          </button>

          {/* Lesson position */}
          <div className="flex shrink-0 flex-col items-center gap-1">
            <span className="text-xs font-semibold tabular-nums text-foreground">
              {course.completedLessons}/{course.totalLessons}
            </span>

            <span className="text-[10px] text-muted-foreground">
              Lessons completed
            </span>
          </div>

          {/* Next lesson */}
          <button
            type="button"
            onClick={() => nextLesson && navigateTo(nextLesson)}
            disabled={!nextLesson}
            className={cn(
              "flex min-w-0 max-w-[42%] items-center justify-end gap-2 rounded-xl px-3 py-2.5 text-end transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-30",
              nextLesson
                ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                : "text-muted-foreground",
            )}
          >
            <span className="min-w-0">
              <span className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Next
              </span>

              <span className="mt-0.5 hidden max-w-36 truncate text-xs font-semibold sm:block">
                {nextLesson?.title ?? "Next lesson"}
              </span>
            </span>

            <ArrowRight className="size-4 shrink-0 rtl:rotate-180" />
          </button>
        </div>
      </footer>
    </div>
  );
}
