
"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, SendHorizontal } from "lucide-react";

import { sendMessage } from "@/actions/chat/sendMessage";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

type ChatUser = {
  id: string;
  name: string | null;
  image: string | null;
};

type Message = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  readAt: Date | null;
  sender: ChatUser;
};

interface ChatViewProps {
  chatId: string;
  currentUserId: string;
  otherUser: ChatUser;
  initialMessages: Message[];
}

export function ChatView({
  chatId,
  currentUserId,
  otherUser,
  initialMessages,
}: ChatViewProps) {
  const router = useRouter();

  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      ),
    [messages]
  );

  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const content = message.trim();

    if (!content || isPending) return;

    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      chatId,
      senderId: currentUserId,
      content,
      createdAt: new Date(),
      readAt: null,
      sender: {
        id: currentUserId,
        name: "You",
        image: null,
      },
    };

    setMessage("");
    setMessages((prev) => [...prev, optimisticMessage]);

    startTransition(async () => {
      try {
        const savedMessage = await sendMessage({
          chatId,
          content,
        });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === optimisticMessage.id
              ? savedMessage
              : msg
          )
        );
      } catch (error) {
        setMessages((prev) =>
          prev.filter(
            (msg) => msg.id !== optimisticMessage.id
          )
        );

        setMessage(content);
        toast.error("Failed to send message. Please try again.");

        console.error("Send message error:", error);
      }
    });
  }

  const initials =
    otherUser.name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-[400px] flex-col overflow-hidden rounded-xl border bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-10 w-10">
          <AvatarImage
            src={otherUser.image ?? undefined}
            alt={otherUser.name ?? "User"}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <h2 className="truncate font-semibold">
            {otherUser.name || "Unknown user"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Conversation
          </p>
        </div>
      </div>

      <Separator />

      {/* Messages */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4 sm:p-6">
          {sortedMessages.length === 0 ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            sortedMessages.map((msg) => {
              const isMine = msg.senderId === currentUserId;

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    isMine ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] break-words rounded-2xl px-4 py-3 shadow-sm sm:max-w-[70%]",
                      isMine
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted"
                    )}
                  >
                    {!isMine && (
                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                        {msg.sender.name || "Unknown user"}
                      </p>
                    )}

                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {msg.content}
                    </p>

                    <p
                      className={cn(
                        "mt-2 text-right text-[11px]",
                        isMine
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <Separator />

      {/* Message Input */}
      <div className="bg-background p-3 sm:p-4">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            value={message}
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            maxLength={2000}
            autoComplete="off"
          />

          <Button
            size="icon"
            type="submit"
            disabled={isPending || !message.trim()}
            aria-label="Send message"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
