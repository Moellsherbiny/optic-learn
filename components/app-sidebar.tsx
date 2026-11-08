
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { signOut } from "next-auth/react"
import {
  BookOpen,
  LayoutDashboard,
  Users,
  Settings2,
  GraduationCap,
  ClipboardList,
  Trophy,
  LogOut,
  UserRound,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import Logo from "./layout/logo"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  unreadMessagesCount?: number
}

type NavigationItem = {
  title: string
  url: string
  icon: React.ElementType
  badge?: number
  exact?: boolean
}

export function AppSidebar({
  unreadMessagesCount = 0,
  className,
  ...props
}: AppSidebarProps) {
  const pathname = usePathname()
  const locale = useLocale()

  const t = useTranslations("Common")
  const sidebarItems = useTranslations("Sidebar")

  const isRTL = locale.startsWith("ar")
  const basePath = `/${locale}`

  // Normalize the current route by removing the locale prefix.
  const normalizedPathname =
    pathname.replace(/^\/[^/]+(?=\/|$)/, "") || "/"

  // Determine the current portal.
  const isTeacher =
    normalizedPathname === "/teacher" ||
    normalizedPathname.startsWith("/teacher/")

  const portalTitle = isTeacher
    ? t("teacherPortal")
    : t("studentPortal")

  // Navigation configuration.
  const navItems: NavigationItem[] = isTeacher
    ? [
        {
          title: t("dashboard"),
          url: "/teacher",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          title: sidebarItems("myCourses"),
          url: "/teacher/courses",
          icon: BookOpen,
        },
        {
          title: sidebarItems("myQuizzes"),
          url: "/teacher/quizzes",
          icon: ClipboardList,
        },
        {
          title: sidebarItems("students"),
          url: "/teacher/students",
          icon: Users,
        },
        {
          title: sidebarItems("messages"),
          url: "/chat",
          icon: MessageCircle,
          badge: unreadMessagesCount,
        },
      ]
    : [
        {
          title: t("dashboard"),
          url: "/student",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          title: sidebarItems("myCourses"),
          url: "/student/courses",
          icon: GraduationCap,
        },
        {
          title: sidebarItems("myQuizzes"),
          url: "/student/quizzes",
          icon: ClipboardList,
          exact: true,
        },
        {
          title: sidebarItems("myQuizAttempts"),
          url: "/quizzes/attempts",
          icon: Trophy,
        },
        {
          title: sidebarItems("messages"),
          url: "/chat",
          icon: MessageCircle,
          badge: unreadMessagesCount,
        },
      ]

  // Handle exact and nested route matching.
  const isItemActive = (item: NavigationItem) => {
    if (item.exact) {
      return normalizedPathname === item.url
    }

    return (
      normalizedPathname === item.url ||
      normalizedPathname.startsWith(`${item.url}/`)
    )
  }

  const DirectionIcon = isRTL ? ChevronLeft : ChevronRight

  const profileActive =
    normalizedPathname === "/profile" ||
    normalizedPathname.startsWith("/profile/")

  return (
    <Sidebar
      {...props}
      side={isRTL ? "right" : "left"}
      variant="inset"
      className={cn(
        "border-none bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      {/* Brand */}
      <SidebarHeader className="px-4 pb-3 pt-5">
        <div className="flex h-12 items-center px-2">
          <Logo />
        </div>

        {/* Portal identity */}
        <div className="mx-2 mt-2 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
              {isTeacher ? (
                <GraduationCap className="size-[18px]" />
              ) : (
                <BookOpen className="size-[18px]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-sidebar-foreground">
                {portalTitle}
              </p>

              <p className="mt-1 text-[10px] text-muted-foreground">
                Optic Learn
              </p>
            </div>

            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-primary"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-1 px-3 pt-4">
        {/* Main navigation */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 h-7 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {sidebarItems("workspace")}
          </SidebarGroupLabel>

          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const isActive = isItemActive(item)
              const Icon = item.icon

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={cn(
                      "group relative h-10 rounded-xl px-3 transition-colors duration-200",
                      "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary",
                      "hover:data-[active=true]:bg-primary/10"
                    )}
                  >
                    <Link
                      href={`${basePath}${item.url}`}
                      aria-current={isActive ? "page" : undefined}
                      className="flex w-full items-center gap-3"
                    >
                      <Icon
                        className={cn(
                          "size-[18px] shrink-0 transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                        )}
                        strokeWidth={isActive ? 2.1 : 1.8}
                      />

                      <span className="min-w-0 truncate text-[13px]">
                        {item.title}
                      </span>

                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="flex h-[19px] min-w-[19px] shrink-0 items-center justify-center rounded-md bg-primary px-1 text-[10px] font-semibold tabular-nums text-primary-foreground">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}

                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-primary"
                        />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="mx-2 my-4 w-auto bg-sidebar-border/70" />

        {/* Account */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 h-7 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {sidebarItems("account")}
          </SidebarGroupLabel>

          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={profileActive}
                tooltip={sidebarItems("settings")}
                className={cn(
                  "h-10 rounded-xl px-3 text-sidebar-foreground/70 transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                )}
              >
                <Link
                  href={`${basePath}/profile`}
                  aria-current={profileActive ? "page" : undefined}
                  className="flex w-full items-center gap-3"
                >
                  <UserRound className="size-[18px] shrink-0 text-muted-foreground" />

                  <span className="min-w-0 flex-1 truncate text-[13px]">
                    {sidebarItems("settings")}
                  </span>

                  <Settings2 className="size-3.5 shrink-0 text-muted-foreground/70" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-3">
        <div className="rounded-xl border border-sidebar-border/70 bg-sidebar-accent/30 p-1.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() =>
                  signOut({
                    redirectTo: `/${locale}`,
                  })
                }
                tooltip={t("logout")}
                className="h-10 rounded-lg px-3 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-[17px] shrink-0" />

                <span className="flex-1 text-[13px] font-medium">
                  {t("logout")}
                </span>

                <DirectionIcon className="size-3.5 opacity-60" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        <p className="px-2 pb-1 pt-2 text-center text-[10px] text-muted-foreground/70">
          Optic Learn
          <span className="mx-1.5">·</span>
          {sidebarItems("tagline")}
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
