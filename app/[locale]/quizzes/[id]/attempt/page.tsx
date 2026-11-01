
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  Loader2,
} from "lucide-react";

import { getQuizForAttempt } from "@/actions/student/quiz";
import { QuizAttemptClient } from "@/components/student/quiz-attempt-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AttemptPage({ params }: Props) {
  return (
    <Suspense fallback={<QuizLoading />}>
      <AttemptContent params={params} />
    </Suspense>
  );
}

async function AttemptContent({ params }: Props) {
  const { id } = await params;

  const quiz = await getQuizForAttempt(id).catch(() => null);

  if (!quiz) {
    notFound();
  }

  // Prevent duplicate attempts.
  if (quiz.quizAttempts.length > 0) {
    redirect(`/student/quizzes/results/${quiz.quizAttempts[0].id}`);
  }

  return <QuizAttemptClient quiz={quiz} />;
}

function QuizLoading() {
  return (
    <main
      dir="rtl"
      className="flex min-h-dvh items-center justify-center bg-background px-4"
    >
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ClipboardCheck className="size-7" />
        </div>

        <h1 className="text-lg font-semibold text-foreground">
          جاري تجهيز الاختبار
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          نقوم بإعداد الأسئلة وتجهيز تجربتك التعليمية...
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>لحظات قليلة</span>
        </div>
      </div>
    </main>
  );
}
