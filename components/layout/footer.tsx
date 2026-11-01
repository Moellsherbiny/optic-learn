
"use client";

import { useTranslations } from "next-intl";
import Logo from "./logo";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-8 md:flex-row lg:px-12">
        <Logo size="sm" />

        <div className="text-center text-sm text-muted-foreground md:text-end">
          <p>{t("rights")}</p>
          <p>{t("dept")}</p>
        </div>
      </div>
    </footer>
  );
}
