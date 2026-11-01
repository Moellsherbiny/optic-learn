
import { redirect } from "next/navigation";
import { getStudyPageData } from "@/actions/study";
import { StudySidebar } from "@/components/study/StudySidebar";
import { StudyHeader } from "@/components/study/StudyHeader";
import { PreQuizRequired } from "@/components/study/preQuizReq";

interface Props {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}

export default async function StudyLayout({ children, params }: Props) {
  const { courseId } = await params;

  // Fetch course and modules data for the study sidebar.
  const result = await getStudyPageData(courseId);

  if (!result.success) {
    if (result.error === "PRE_QUIZ_REQUIRED") {
      return (
        <PreQuizRequired
          quizId={result.preQuiz!.id}
          title={result.preQuiz!.title}
          courseId={courseId}         />
      );
    }

    redirect(`/courses/${courseId}`);
  }

  const { course, modules } = result.data;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* Study header */}
      <StudyHeader course={course} modules={modules} />

      {/* Study workspace */}
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* Course sidebar */}
        <aside className="hidden w-80 shrink-0 flex-col overflow-y-auto border-e border-border bg-sidebar md:flex lg:w-96">
          <StudySidebar
            courseId={courseId}
            modules={modules}
            progressPercent={course.progressPercent}
            completedLessons={course.completedLessons}
            totalLessons={course.totalLessons}
          />
        </aside>

        {/* Lesson content */}
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
