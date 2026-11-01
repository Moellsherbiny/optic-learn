import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Circle } from "lucide-react";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("LandingPage");

  return (
    <footer className="mt-auto border-t border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-4 py-6 sm:px-8 md:grid-cols-3 md:items-center lg:px-12">
        {/* Brand */}
        <Link
          href={`/${locale}`}
          className="flex w-fit items-center gap-2.5"
          aria-label="Optic Learn home"
        >
          <Circle className="size-6 text-primary" />
        </Link>

        {/* Description */}
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground md:justify-self-center md:text-center">
          {t("footer.description")}
        </p>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground md:justify-self-end">
          © {new Date().getFullYear()} Optic Learn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
