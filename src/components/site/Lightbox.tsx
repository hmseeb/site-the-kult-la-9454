import { useCallback, useEffect } from "react";

export type LightboxItem = {
  image: string;
  caption: string;
  meta?: string;
};

type Props = {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function Lightbox({ items, index, onClose, onIndexChange }: Props) {
  const open = index !== null && index >= 0 && index < items.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null || items.length === 0) return;
      onIndexChange((index + dir + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, go]);

  if (!open || index === null) return null;
  const item = items[index];
  if (!item) return null;


  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      className="fixed inset-0 z-[200] flex flex-col bg-background/97 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 lg:px-8">
        <span className="text-[0.65rem] uppercase tracking-[0.18em] text-concrete">
          {index + 1} / {items.length}
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="border border-border px-4 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-brass hover:text-brass"
        >
          Close
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-3 pb-2 sm:px-16">
        <img
          src={item.image}
          alt={item.caption}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full object-contain"
        />

        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 border border-border bg-background/70 px-3 py-4 text-cream/80 transition-colors hover:border-brass hover:text-brass sm:left-5"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 border border-border bg-background/70 px-3 py-4 text-cream/80 transition-colors hover:border-brass hover:text-brass sm:right-5"
            >
              →
            </button>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-baseline justify-end gap-3 px-5 pb-8 pt-4 lg:px-8">
        {item.meta && (
          <span className="text-[0.65rem] uppercase tracking-[0.16em] text-concrete">
            {item.meta}
          </span>
        )}
      </div>

    </div>
  );
}
