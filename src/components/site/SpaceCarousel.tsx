import { useCallback, useEffect, useState } from "react";
import { spaceTour } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SpaceCarousel() {
  const [i, setI] = useState(0);
  const total = spaceTour.length;
  const active = spaceTour[i] ?? spaceTour[0];
  const [loaded, setLoaded] = useState([0]);
  useEffect(() => setLoaded((previous) => previous.includes(i) ? previous : [...previous, i]), [i]);

  const go = useCallback(
    (n: number) => setI((c) => (c + n + total) % total),
    [total],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(id);
  }, [go]);

  if (!active) return null;

  return (
    <div className="relative">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-charcoal sm:aspect-16/9">
        {spaceTour.map((s, idx) => loaded.includes(idx) || idx === i ? (
          <img
            key={s.image}
            src={s.image}
            alt={s.alt}
            loading="lazy"
            decoding="async"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out",
              idx === i ? "opacity-100" : "opacity-0",
            )}
          />
        ) : null)}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-background/90 to-transparent p-4 sm:p-6">
          <p className="display text-xl text-cream sm:text-3xl">{active.label}</p>
          <div className="flex items-center gap-2">
            <span className="text-[0.65rem] uppercase tracking-[0.16em] text-cream/70">
              {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Previous space"
              onClick={() => go(-1)}
              className="border border-cream/40 px-3 py-1.5 text-cream transition-colors hover:border-brass hover:text-brass"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next space"
              onClick={() => go(1)}
              className="border border-cream/40 px-3 py-1.5 text-cream transition-colors hover:border-brass hover:text-brass"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-5 gap-2">
        {spaceTour.map((s, idx) => (
          <button
            key={s.label}
            type="button"
            aria-label={`Show ${s.label}`}
            onClick={() => setI(idx)}
            className={cn(
              "aspect-16/10 overflow-hidden border transition-opacity",
              idx === i ? "border-brass opacity-100" : "border-transparent opacity-50 hover:opacity-90",
            )}
          >
            <img src={s.image} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
