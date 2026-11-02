import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "text";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[0.7rem] font-medium uppercase tracking-[0.18em] transition-all duration-300";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary px-7 py-4 text-primary-foreground hover:bg-amber hover:text-accent-foreground",
  outline:
    "border border-border px-7 py-4 text-foreground hover:border-brass hover:text-brass",
  ghost:
    "border border-transparent bg-secondary px-7 py-4 text-foreground hover:border-brass",
  text: "text-brass underline-offset-8 hover:text-amber hover:underline",
};

export function Cta({
  to,
  href,
  search,
  variant = "primary",
  className,
  children,
}: {
  to?: string;
  href?: string;
  search?: Record<string, string>;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  const cls = cn(base, variants[variant], className);
  if (to) {
    return (
      <Link to={to} search={search as never} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("label-xs", className)}>{children}</p>;
}

export function SectionHead({
  number,
  label,
  title,
  copy,
  className,
}: {
  number?: string;
  label?: string;
  title: ReactNode;
  copy?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <div className="flex items-baseline gap-4">
        {number && <span className="section-number">{number}</span>}
        {label && <Label>{label}</Label>}
      </div>
      <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
      {copy && <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">{copy}</p>}
    </div>
  );
}
