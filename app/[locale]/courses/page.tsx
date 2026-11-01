
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getAllCourses } from "@/actions/courses";
import CoursesClient from "@/components/course/CourseClient";

export default async function StudentCoursesPage() {
  const locale = await getLocale();
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`);
  }

  const courses = await getAllCourses();

  return (
    <CoursesClient
      courses={courses}
      locale={locale}
    />
  );
}
