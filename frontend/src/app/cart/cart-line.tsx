"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  cartKey: string;
  name: string;
  quantity: number;
  image?: string;
  permalink: string;
  lineTotal: string;
};

export function CartLine({ cartKey, name, quantity, image, permalink, lineTotal }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function remove() {
    start(async () => {
      await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: cartKey }),
      });
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-6 py-6">
      <a href={permalink} className="w-20 h-24 bg-ink/5 shrink-0 overflow-hidden">
        {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : null}
      </a>
      <div className="flex-1">
        <a href={permalink} className="serif-display text-base tracking-wider2 hover:text-ruby transition-colors">{name}</a>
        <p className="text-sm text-ink/60 mt-1">Qty {quantity}</p>
      </div>
      <div className="text-right">
        <p className="text-base">{lineTotal}</p>
        <button onClick={remove} disabled={pending} className="label text-ink/40 hover:text-ruby mt-2 disabled:opacity-40">
          {pending ? "Removing…" : "Remove"}
        </button>
      </div>
    </div>
  );
}
