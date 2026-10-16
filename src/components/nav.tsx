"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { href: "/#review", label: "Review" },
  { href: "/#samples", label: "Samples" },
  { href: "/#how", label: "How it works" },
  { href: "/qa", label: "Q&A" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-display text-[15px] font-bold tracking-tight">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 3h9l5 5v13H4z" />
            <path d="M13 3v5h5" />
            <path d="M8 13h7" />
            <path d="M8 17h5" />
          </svg>
          UangCounsel
        </Link>
        <nav className="ml-auto hidden items-center gap-5 text-sm text-muted sm:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-fg transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto sm:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
