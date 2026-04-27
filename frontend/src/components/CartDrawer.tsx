"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function formatMoney(minor: string, code: string, mu: number) {
  return (Number(minor) / 10 ** mu).toLocaleString("en-GB", {
    style: "currency",
    currency: code || "GBP",
  });
}

export function CartDrawer() {
  const { cart, isOpen, close, removeItem } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={
          "fixed inset-0 z-[65] bg-ink/40 transition-opacity duration-300 " +
          (isOpen ? "opacity-100" : "opacity-0 pointer-events-none")
        }
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className={
          "fixed top-0 right-0 z-[70] h-screen w-full sm:w-[420px] bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out " +
          (isOpen ? "translate-x-0" : "translate-x-full")
        }
      >
        <header className="flex items-center justify-between px-6 h-20 border-b hairline">
          <h2 className="serif-display text-base tracking-widest2">
            Cart {cart && cart.items_count > 0 ? `(${cart.items_count})` : ""}
          </h2>
          <button
            onClick={close}
            aria-label="Close cart"
            className="p-2 hover:text-ruby transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {!cart || cart.items.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-ink/60 mb-6">Your cart is empty.</p>
              <button
                onClick={close}
                className="label tracking-widest2 inline-block border border-ink px-6 py-3 hover:bg-ink hover:text-white transition-colors"
              >
                Continue browsing
              </button>
            </div>
          ) : (
            <ul className="divide-y hairline">
              {cart.items.map((item) => (
                <li key={item.key} className="flex gap-4 p-6">
                  <div className="w-20 h-24 bg-ink/5 shrink-0 overflow-hidden">
                    {item.images[0]?.src ? (
                      <img
                        src={item.images[0].src}
                        alt={item.images[0]?.alt || item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="title text-sm leading-snug mb-1 truncate">{item.name}</p>
                    <p className="text-xs text-ink/50 mb-2">Qty {item.quantity}</p>
                    <p className="text-sm">
                      {formatMoney(
                        item.totals.line_total,
                        item.totals.currency_code,
                        item.totals.currency_minor_unit,
                      )}
                    </p>
                    <button
                      onClick={() => removeItem(item.key)}
                      className="label text-ink/40 hover:text-ruby mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart && cart.items.length > 0 ? (
          <footer className="border-t hairline p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="label">Subtotal</span>
              <span className="title text-xl">
                {formatMoney(
                  cart.totals.total_price,
                  cart.totals.currency_code,
                  cart.totals.currency_minor_unit,
                )}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={close}
              className="label tracking-widest2 block text-center w-full bg-ink text-white px-6 py-4 hover:bg-ruby transition-colors"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={close}
              className="label tracking-widest2 block text-center w-full text-ink/70 hover:text-ink"
            >
              View full cart
            </Link>
          </footer>
        ) : null}
      </aside>
    </>
  );
}
