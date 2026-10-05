"use client";

import * as Dialog from "@radix-ui/react-dialog";
import LiteYouTube from "@/components/LiteYouTube";

type ShowreelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
  triggerLabel?: string;
};

export default function ShowreelDialog({
  open,
  onOpenChange,
  url,
  title,
  triggerLabel = "Showreel",
}: ShowreelDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button type="button" className="btn-text">
          {triggerLabel}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-base/90 data-[state=open]:animate-[fadeIn_160ms_var(--ease-oxide)]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(920px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 border border-border bg-elevated p-3 outline-none md:p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <Dialog.Title className="font-meta">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" className="btn-text">
                Close
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Play the showreel video
          </Dialog.Description>
          <LiteYouTube url={url} title={title} kind="youtube" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
