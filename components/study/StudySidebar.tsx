
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  PlayCircle,
  FileText,
  Paperclip,
  Layers,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ModuleWithProgress,
  LessonWithProgress,
} from "@/types/study";
import { LessonType, StudentLevel } from "@/types/study";

interface Props {
  courseId: string;
  modules: ModuleWithProgress[];
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  onLessonSelect?: () => void;
}

const lessonIcon = {
  [LessonType.VIDEO]: PlayCircle,
  [LessonType.TEXT]: FileText,
  [LessonType.MATERIAL]: Paperclip,
  [LessonType.AR_MODEL]: Layers,
};

const levelColor: Record<StudentLevel, string> = {
  [StudentLevel.BEGINNER]:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  [StudentLevel.INTERMEDIATE]:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  [StudentLevel.ADVANCED]:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function StudySidebar({
  courseId,
  modules,
  progressPercent,
  completedLessons,
  totalLessons,
  onLessonSelect,
}: Props) {
  const params = useParams();
  const activeLessonId = params?.lessonId as string | undefined;

  // Open the module containing the active lesson by default.
  const defaultOpen = modules.find((module) =>
    module.lessons.some((lesson) => lesson.id === activeLessonId),
  )?.id;

  const [openModules, setOpenModules] = useState<Set<string>>(
    new Set(defaultOpen ? [defaultOpen] : modules[0] ? [modules[0].id] : []),
  );

  const progress = Math.min(100, Math.max(0, progressPercent));

  function toggleModule(id: string) {
    setOpenModules((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground">
      {/* Progress summary */}
      <div className="shrink-0 border-b border-sidebar-border p-4">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">Your progress</span>

          <span className="font-semibold tabular-nums text-primary">
            {completedLessons} / {totalLessons} lessons
          </span>
        </div>

        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
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

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {progress}% complete
          </span>

          {progress === 100 && (
            <span className="font-medium text-primary">
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Modules list */}
      <nav
        aria-label="Course modules and lessons"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"
      >
        {modules.map((module, moduleIndex) => {
          const isOpen = openModules.has(module.id);
          const previousModule =
            moduleIndex > 0 ? modules[moduleIndex - 1] : null;

          const isLocked =
            previousModule !== null &&
            previousModule.completedCount < previousModule.totalCount;

          const isModuleCompleted =
            module.totalCount > 0 &&
            module.completedCount >= module.totalCount;

          return (
            <div
              key={module.id}
              className="border-b border-sidebar-border last:border-0"
            >
              {/* Module header */}
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                disabled={isLocked}
                aria-expanded={!isLocked && isOpen}
                className={cn(
                  "group flex w-full items-center gap-3 px-4 py-3 text-start transition-colors",
                  isLocked
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isModuleCompleted
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {isModuleCompleted ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    moduleIndex + 1
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground transition-colors">
                    {module.title}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        levelColor[module.level],
                      )}
                    >
                      {module.level.toLowerCase()}
                    </span>

                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {module.completedCount}/{module.totalCount}
                    </span>
                  </div>
                </div>

                {isLocked ? (
                  <Lock
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-label="Locked module"
                  />
                ) : (
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                )}
              </button>

              {/* Lessons list */}
              {isOpen && !isLocked && (
                <ul className="space-y-0.5 px-2 pb-2">
                  {module.lessons.map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      courseId={courseId}
                      isActive={lesson.id === activeLessonId}
                      onSelect={onLessonSelect}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        {modules.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No modules available.
          </p>
        )}
      </nav>
    </div>
  );
}

function LessonItem({
  lesson,
  courseId,
  isActive,
  onSelect,
}: {
  lesson: LessonWithProgress;
  courseId: string;
  isActive: boolean;
  onSelect?: () => void;
}) {
  const Icon = lessonIcon[lesson.type] ?? FileText;

  return (
    <li>
      <Link
        href={`/courses/${courseId}/study/${lesson.id}`}
        onClick={onSelect}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex min-w-0 items-center gap-2.5 rounded-md border-s-2 px-3 py-2.5 ps-10 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive
            ? "border-s-primary bg-primary/10 text-foreground"
            : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
        )}
      >
        {/* Completion indicator */}
        {lesson.isCompleted ? (
          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
        ) : (
          <Circle className="size-4 shrink-0 text-muted-foreground/50" />
        )}

        {/* Lesson type icon */}
        <Icon
          className={cn(
            "size-3.5 shrink-0",
            isActive ? "text-primary" : "text-muted-foreground",
          )}
        />

        {/* Lesson title */}
        <span className="min-w-0 flex-1 truncate">
          {lesson.title}
        </span>

        {/* AR badge */}
        {lesson.type === LessonType.AR_MODEL && (
          <span className="shrink-0 rounded bg-fuchsia-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fuchsia-600 dark:text-fuchsia-400">
            AR
          </span>
        )}
      </Link>
    </li>
  );
}
