
"use client";

import type { LessonWithProgress } from "@/types/study";
import ReactMarkdown from "react-markdown";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  lesson: LessonWithProgress;
}

export function TextLesson({ lesson }: Props) {
  const locale = useLocale();
  const t = useTranslations("study");

  const direction = locale === "ar" ? "rtl" : "ltr";

  if (!lesson.content) {
    return (
      <div
        dir={direction}
        className="flex min-h-40 items-center justify-center rounded-2xl border border-border bg-card px-6 py-10 text-center"
      >
        <p className="text-sm text-muted-foreground">
          {t("noContent")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-8">
      <article
        dir={direction}
        className="
          prose prose-neutral dark:prose-invert
          max-w-none
          text-start

          prose-headings:font-bold
          prose-headings:tracking-tight
          prose-headings:text-foreground

          prose-h1:mb-6
          prose-h1:mt-2
          prose-h1:text-3xl
          sm:prose-h1:text-4xl

          prose-h2:mb-5
          prose-h2:mt-10
          prose-h2:border-b
          prose-h2:border-border
          prose-h2:pb-3
          prose-h2:text-2xl
          sm:prose-h2:text-3xl

          prose-h3:mb-4
          prose-h3:mt-8
          prose-h3:text-xl
          sm:prose-h3:text-2xl

          prose-h4:mb-3
          prose-h4:mt-7
          prose-h4:text-lg

          prose-p:my-5
          prose-p:leading-[2]
          prose-p:text-muted-foreground

          prose-strong:font-semibold
          prose-strong:text-foreground

          prose-em:text-muted-foreground

          prose-ul:my-5
          prose-ul:space-y-2

          prose-ol:my-5
          prose-ol:space-y-2

          prose-li:leading-8
          prose-li:text-muted-foreground
          prose-li:marker:text-primary

          prose-a:font-medium
          prose-a:text-primary
          prose-a:underline
          prose-a:underline-offset-4
          hover:prose-a:opacity-80

          prose-blockquote:my-7
          prose-blockquote:rounded-xl
          prose-blockquote:border-s-4
          prose-blockquote:border-e-0
          prose-blockquote:border-primary
          prose-blockquote:bg-muted/50
          prose-blockquote:px-5
          prose-blockquote:py-3
          prose-blockquote:text-muted-foreground
          prose-blockquote:[&>p]:my-1

          prose-img:mx-auto
          prose-img:my-8
          prose-img:rounded-xl
          prose-img:border
          prose-img:border-border
          prose-img:shadow-sm

          prose-hr:my-9
          prose-hr:border-border

          prose-table:my-0
          prose-table:w-full
          prose-table:border-collapse

          prose-th:border
          prose-th:border-border
          prose-th:bg-muted
          prose-th:px-4
          prose-th:py-3
          prose-th:text-start
          prose-th:font-semibold
          prose-th:text-foreground

          prose-td:border
          prose-td:border-border
          prose-td:px-4
          prose-td:py-3
          prose-td:text-start
          prose-td:text-muted-foreground

          prose-code:rounded-md
          prose-code:bg-muted
          prose-code:px-1.5
          prose-code:py-1
          prose-code:font-mono
          prose-code:text-sm
          prose-code:text-primary
          prose-code:before:content-none
          prose-code:after:content-none

          prose-pre:my-7
          prose-pre:overflow-x-auto
          prose-pre:rounded-xl
          prose-pre:border
          prose-pre:border-border
          prose-pre:bg-muted
          prose-pre:p-0
        "
      >
        <ReactMarkdown
          components={{
            pre({ children }) {
              return (
                <pre
                  dir="ltr"
                  className="
                    my-7 overflow-x-auto rounded-xl
                    border border-border bg-muted
                    p-4 text-start text-sm
                    leading-relaxed
                    sm:p-5
                  "
                >
                  {children}
                </pre>
              );
            },

            code({ className, children, ...props }) {
              const isBlock = Boolean(className?.includes("language-"));

              return (
                <code
                  dir="ltr"
                  className={
                    isBlock
                      ? "font-mono text-sm text-foreground"
                      : "rounded-md bg-muted px-1.5 py-1 font-mono text-sm text-primary"
                  }
                  {...props}
                >
                  {children}
                </code>
              );
            },

            img({ alt, ...props }) {
              return (
                <img
                  {...props}
                  alt={alt ?? ""}
                  loading="lazy"
                  decoding="async"
                  className="
                    mx-auto my-8 max-h-130 max-w-full
                    rounded-xl border border-border
                    object-contain shadow-sm
                  "
                />
              );
            },

            table({ children }) {
              return (
                <div className="my-8 w-full overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-120 border-collapse">
                    {children}
                  </table>
                </div>
              );
            },
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
