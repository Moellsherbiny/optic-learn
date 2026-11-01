
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getStudyPageData } from "@/actions/study";
import { LessonView } from "@/components/study/LessonView";

interface Props {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { courseId, lessonId } = await params;

  const result = await getStudyPageData(courseId, lessonId);

  if (!result.success || !result.data.currentLesson) {
    return {
      title: "Lesson",
    };
  }

  const { currentLesson, course } = result.data;

  return {
    title: `${currentLesson.title} | ${course.title}`,
    description: `Study ${currentLesson.title} in ${course.title}.`,
  };
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = await params;

  const result = await getStudyPageData(courseId, lessonId);

  if (!result.success) {
    redirect(
      `/courses/${courseId}?error=${encodeURIComponent(result.error)}`,
    );
  }

  const {
    currentLesson,
    currentModule,
    nextLesson,
    prevLesson,
    course,
    modules,
  } = result.data;

  if (!currentLesson) {
    notFound();
  }

  return (
    <LessonView
      lesson={currentLesson}
      module={currentModule}
      course={course}
      modules={modules}
      nextLesson={nextLesson}
      prevLesson={prevLesson}
    />
  );
}
