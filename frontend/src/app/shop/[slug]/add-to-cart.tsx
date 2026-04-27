"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({ productId, disabled }: { productId: number; disabled?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const { addItem } = useCart();

  function add() {
    setErr(null);
    startTransition(async () => {
      const ok = await addItem(productId, 1);
      if (!ok) setErr("Could not add to cart.");
    });
  }

  return (
    <div>
      <button
        onClick={add}
        disabled={disabled || pending}
        className="label tracking-widest2 px-8 py-4 border border-ink hover:bg-ink hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {pending ? "Adding…" : "Add to cart"}
      </button>
      {err ? <p className="label text-ruby mt-3">{err}</p> : null}
    </div>
  );
}
