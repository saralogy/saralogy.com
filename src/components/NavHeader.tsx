"use client";

import { useState } from "react";

const links = [
  { label: "Insights", href: "/insights" },
  { label: "Travel", href: "/travel" },
  { label: "Build", href: "/build" },
  { label: "About", href: "/about" },
  { label: "Career", href: "/career" },
  { label: "Projects", href: "/projects" },
  { label: "Music", href: "/music" },
];

export function NavHeader() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between h-14">
        {/* Logo */}
        <a href="/" className="flex items-baseline gap-2">
          <span
            className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            ©2026
          </span>
          <span
            className="text-sm font-semibold tracking-[0.12em] uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Saralogy
          </span>
          <sup className="text-[10px] -mt-3 tracking-normal">®</sup>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-200"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/start"
            className="text-[12px] tracking-widest uppercase border border-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-all duration-200"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Work with me
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-[1px] w-6 bg-foreground transition-all duration-200"
            style={{ transform: open ? "rotate(45deg) translateY(6px)" : "none" }}
          />
          <span
            className="block h-[1px] w-6 bg-foreground transition-all duration-200"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block h-[1px] w-6 bg-foreground transition-all duration-200"
            style={{ transform: open ? "rotate(-45deg) translateY(-6px)" : "none" }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 pb-6 pt-4 flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wider text-foreground"
              style={{ fontFamily: "var(--font-body)" }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/start"
            className="mt-2 text-[12px] tracking-widest uppercase border border-foreground px-5 py-2 text-center"
            style={{ fontFamily: "var(--font-body)" }}
            onClick={() => setOpen(false)}
          >
            Work with me
          </a>
        </div>
      )}
    </nav>
  );
}
