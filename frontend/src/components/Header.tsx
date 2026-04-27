"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

function BagIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 9h14l-0.5 11a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2L5 9z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden>
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="16" x2="20" y2="16" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

const NAV: Array<{ label: string; href: string }> = [
  { label: "Shop All", href: "/shop" },
  { label: "Modern Watches", href: "/shop?category=modern" },
  { label: "Vintage Watches", href: "/shop?category=vintage" },
  { label: "The Brands", href: "/shop" },
  { label: "Sell Your Watch", href: "/sell-your-watch" },
  { label: "Watch Repairs", href: "/repairs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, open: openCart } = useCart();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white border-b hairline">
        <div className="h-20 flex items-center justify-between px-6">
          <Link href="/" aria-label="The Watch Locator — home" className="block">
            <Image
              src="/logo.png"
              alt="The Watch Locator"
              width={1136}
              height={444}
              priority
              className="h-10 w-auto sm:h-12"
            />
          </Link>
          <div className="flex items-center gap-5 text-ink">
            <button
              type="button"
              aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
              onClick={openCart}
              className="relative hover:text-ruby transition-colors"
            >
              <BagIcon className="w-6 h-6" />
              {count > 0 ? (
                <span
                  className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-ink text-white text-[10px] font-medium flex items-center justify-center"
                  aria-hidden
                >
                  {count}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="hover:text-ruby transition-colors"
            >
              <MenuIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={
          "fixed inset-0 z-[60] bg-ink text-bone transition-opacity duration-300 " +
          (menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 p-2 hover:text-brass transition-colors"
        >
          <CloseIcon className="w-7 h-7" />
        </button>

        <nav className="h-full flex flex-col items-center justify-center gap-5 sm:gap-6 px-6 text-center">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="serif-display text-lg sm:text-2xl text-bone hover:text-brass transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 inset-x-0 text-center label text-bone/50">
          Mayfair · By Appointment · +44 (0) 207 629 5573
        </div>
      </div>
    </>
  );
}
