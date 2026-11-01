import { redirect } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  MessageCircleMore,
  Plus,
  Users,
} from "lucide-react";

import { auth } from "@/auth";
import { getChats } from "@/actions/chat/getChats";
import { getChatUsers } from "@/actions/chat/getChatUsers";

import CreateChatDialog from "@/components/chat/create-chat-dialog";
import DeleteChatDialog from "@/components/chat/delete-chat-dialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { getLocale, getTranslations } from "next-intl/server";

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [result, usersResult, locale, t] = await Promise.all([
    getChats(),
    getChatUsers(),
    getLocale(),
    getTranslations("Chat"),
  ]);

  if (!usersResult.success) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          {t("errors.loadUsers")}
        </div>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          {t("errors.loadChats")}
        </div>
      </div>
    );
  }

  const chats = result.data ?? [];

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageCircle className="size-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </div>

        <CreateChatDialog users={usersResult.data ?? []} />
      </div>

      {/* Conversation count */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{t("conversations")}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("conversationCount", { count: chats.length })}
          </p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Users className="size-4" />
        </div>
      </div>

      {/* Conversation list */}
      {chats.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="divide-y divide-border">
            {chats.map((chat) => {
              // getChats returns the latest message first (descending order).
              const lastMessage = chat.messages[0];
              const participantName =
                chat.participant.name ?? t("unknownUser");

              return (
                <div
                  key={chat.id}
                  className="group flex items-center gap-3 p-4 transition-colors hover:bg-muted/50 sm:gap-4 sm:px-5"
                >
                  <Link
                    href={`/${locale}/chat/${chat.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4"
                  >
                    <Avatar className="size-12 shrink-0 ring-2 ring-background">
                      <AvatarImage
                        src={chat.participant.image ?? undefined}
                        alt={participantName}
                      />
                      <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                        {participantName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-primary sm:text-base">
                          {participantName}
                        </h3>

                        {chat.lastMessageAt && (
                          <time
                            dateTime={new Date(
                              chat.lastMessageAt,
                            ).toISOString()}
                            className="shrink-0 text-[11px] text-muted-foreground sm:text-xs"
                          >
                            {formatDate(chat.lastMessageAt)}
                          </time>
                        )}
                      </div>

                      <p className="truncate text-sm text-muted-foreground">
                        {lastMessage?.content ?? t("noMessages")}
                      </p>
                    </div>
                  </Link>

                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={`/${locale}/chat/${chat.id}`}
                      aria-label={t("openConversationWith", {
                        name: participantName,
                      })}
                      className="hidden size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary sm:flex"
                    >
                      <MessageCircleMore className="size-4" />
                    </Link>

                    {/* The current user owns every chat returned by getChats. */}
                    <DeleteChatDialog chatId={chat.id} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-12 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageCircle className="size-8" />
          </div>

          <h3 className="text-lg font-semibold">
            {t("empty.title")}
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {session.user.role === "TEACHER"
              ? t("empty.teacherDescription")
              : t("empty.studentDescription")}
          </p>

          <div className="mt-6">
            <CreateChatDialog
              users={usersResult.data ?? []}
              triggerLabel={t("newConversation")}
            />
          </div>
        </div>
      )}
    </div>
  );
}