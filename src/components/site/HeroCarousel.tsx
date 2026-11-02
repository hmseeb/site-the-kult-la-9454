import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { heroSlides } from "@/lib/site";
import { cn } from "@/lib/utils";

type HeroCtx = { index: number; setIndex: (i: number) => void };
const Ctx = createContext<HeroCtx | null>(null);

export function HeroCarousel({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % heroSlides.length),
      6000,
    );
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo(() => ({ index, setIndex }), [index]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function HeroBackdrop() {
  const ctx = useContext(Ctx);
  const index = ctx?.index ?? 0;

  const [loaded, setLoaded] = useState([0]);
  useEffect(() => setLoaded((previous) => previous.includes(index) ? previous : [...previous, index]), [index]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {heroSlides.map((slide, i) => loaded.includes(i) || i === index ? (
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          loading="eager"
          fetchPriority={i === 0 ? "high" : "auto"}
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null)}
      {/* dark film over the photography */}
      <div className="film-veil absolute inset-0" />
      <div className="absolute inset-0 bg-background/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />
    </div>
  );
}

export function HeroDots({ className }: { className?: string }) {
  const ctx = useContext(Ctx);
  if (!ctx) return null;

  return (
    <div className={cn("flex gap-2", className)}>
      {heroSlides.map((slide, i) => (
        <button
          key={slide.image}
          type="button"
          aria-label={`Show venue image ${i + 1}`}
          aria-current={i === ctx.index}
          onClick={() => ctx.setIndex(i)}
          className={cn(
            "h-[2px] w-8 transition-colors sm:w-10",
            i === ctx.index ? "bg-brass" : "bg-cream/30 hover:bg-cream/60",
          )}
        />
      ))}
    </div>
  );
}
