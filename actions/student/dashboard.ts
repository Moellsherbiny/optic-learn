
"use server";

import { prisma } from "@/lib/prisma";

export async function getStudentDashboardData(userId: string) {
  try {
    // 1. Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        level: true,
        name: true,
      },
    });

    // 2. Get enrolled course
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentId: userId },
      include: {
        course: {
          include: {
            teacher: {
              select: { name: true },
            },
            modules: {
              include: {
                lessons: {
                  select: {
                    id: true,
                    title: true,
                    progress: {
                      where: { studentId: userId },
                      select: {
                        completed: true,
                        updatedAt: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // 3. Calculate course progress
    const courses = enrollment
      ? (() => {
          const course = enrollment.course;

          const allLessons = course.modules.flatMap(
            (module) => module.lessons
          );

          const totalLessons = allLessons.length;

          const completedLessons = allLessons.filter(
            (lesson) => lesson.progress.some(
              (progress) => progress.completed
            )
          ).length;

          const percentage =
            totalLessons > 0
              ? Math.round(
                  (completedLessons / totalLessons) * 100
                )
              : 0;

          return [{
            id: course.id,
            title: course.title,
            titleEn: course.titleEnglish,
            instructor: course.teacher?.name ?? "",
            thumbnail: course.thumbnail,
            totalLessons,
            completedLessons,
            percentage,
          }];
        })()
      : [];

    // 4. Get latest lesson progress
    const latestProgressRecord = await prisma.progress.findFirst({
      where: {
        studentId: userId,
        lesson: {
          module: {
            course: {
              enrollments: {
                some: { studentId: userId },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    // 5. Global stats
    const completedCourses = courses.filter(
      (course) =>
        course.totalLessons > 0 &&
        course.completedLessons === course.totalLessons
    ).length;

    const totalLessonsCompleted = courses.reduce(
      (sum, course) => sum + course.completedLessons,
      0
    );

    // 6. Latest lesson
    const latestLesson = latestProgressRecord
      ? {
          id: latestProgressRecord.lesson.id,
          title: latestProgressRecord.lesson.title,
          moduleTitle: latestProgressRecord.lesson.module.title,
          courseTitle: latestProgressRecord.lesson.module.course.title,
          percentage: latestProgressRecord.completed ? 100 : 0,
        }
      : null;

    return {
      userLevel: user?.level ?? "BEGINNER",
      courses,
      stats: {
        completedCourses,
        totalLessonsCompleted,
      },
      latestLesson,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch dashboard data.");
  }
}
