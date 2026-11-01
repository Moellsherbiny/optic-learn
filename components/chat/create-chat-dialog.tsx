"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createChat } from "@/actions/chat/createChat";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatUser {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
  
}

interface Props {
  users: ChatUser[] ;
  triggerLabel?: string;
}

export default function CreateChatDialog({
  users,
  triggerLabel,
}: Props) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Chat");

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(locale);

    if (!query) return users;

    return users.filter((user) => {
      const name = user.name ?? "";
      const searchableText = `${name} ${user.email}`.toLocaleLowerCase(
        locale,
      );

      return searchableText.includes(query);
    });
  }, [users, search, locale]);

  const handleCreateChat = (receiverId: string) => {
    if (isPending) return;

    startTransition(async () => {
      try {
        const result = await createChat({ receiverId });

        if (!result.success || !result.chat?.id) {
          toast.error(result.message ?? t("errors.createChat"));
          return;
        }

        setOpen(false);
        setSearch("");

        router.push(`/${locale}/chat/${result.chat.id}`);
        router.refresh();
      } catch {
        toast.error(t("errors.createChat"));
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) {
          setOpen(nextOpen);

          if (!nextOpen) setSearch("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          {triggerLabel ?? t("newConversation")}
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b px-5 py-5 text-start">
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>
            {t("create.description")}
          </DialogDescription>
        </DialogHeader>

        <Command shouldFilter={false} className="rounded-none">
          <div className="flex items-center border-b px-3">
            <Search className="me-2 size-4 shrink-0 text-muted-foreground" />

            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={t("create.searchPlaceholder")}
              className="border-0"
            />
          </div>

          <CommandList className="max-h-85 p-2">
            <CommandEmpty className="py-8 text-sm text-muted-foreground">
              {users.length === 0
                ? t("create.noUsersAvailable")
                : t("create.noUsersFound")}
            </CommandEmpty>

            {filteredUsers.length > 0 && (
              <CommandGroup heading={t("create.availableUsers")}>
                {filteredUsers.map((user) => {
                  const name = user.name ?? t("unknownUser");

                  return (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      disabled={isPending}
                      onSelect={() => handleCreateChat(user.id)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3"
                    >
                      <Avatar className="size-10 shrink-0">
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={name}
                        />
                        <AvatarFallback className="bg-primary/10 font-medium text-primary">
                          {name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>

                      {isPending && (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>

        <div className="border-t bg-muted/30 px-5 py-3">
          <p className="text-xs text-muted-foreground">
            {t("create.footer")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}