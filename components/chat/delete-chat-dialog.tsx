"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { deleteChat } from "@/actions/chat/deleteChat";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Props {
  chatId: string;
}

export default function DeleteChatDialog({ chatId }: Props) {
  const router = useRouter();
  const t = useTranslations("Chat");

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteChat = () => {
    if (isPending) return;

    startTransition(async () => {
      try {
        await deleteChat(chatId);

        toast.success(t("delete.success"));
        setOpen(false);
        router.refresh();
      } catch (error) {
        console.error("Delete chat error:", error);
        toast.error(t("errors.deleteChat"));
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("delete.buttonLabel")}
          className="size-9 shrink-0 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Trash2 className="size-5" />
          </div>

          <DialogTitle>{t("delete.title")}</DialogTitle>
          <DialogDescription className="leading-6">
            {t("delete.description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:flex-row-reverse">
          <Button
            variant="destructive"
            onClick={handleDeleteChat}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="me-2 size-4 animate-spin" />
                {t("delete.deleting")}
              </>
            ) : (
              <>
                <Trash2 className="me-2 size-4" />
                {t("delete.confirm")}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("delete.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}