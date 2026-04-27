"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type CartItem = {
  key: string;
  id: number;
  name: string;
  quantity: number;
  permalink: string;
  images: Array<{ src: string; alt: string }>;
  totals: { line_total: string; currency_code: string; currency_minor_unit: number };
};

type Cart = {
  items: CartItem[];
  items_count: number;
  totals: {
    total_price: string;
    currency_code: string;
    currency_minor_unit: number;
    currency_symbol: string;
  };
};

type Ctx = {
  cart: Cart | null;
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  refresh: () => Promise<void>;
  addItem: (id: number, quantity?: number) => Promise<boolean>;
  removeItem: (key: string) => Promise<void>;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (res.ok) setCart(await res.json());
    } catch {
      /* ignore */
    }
  }, []);

  const addItem = useCallback(
    async (id: number, quantity = 1) => {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity }),
      });
      if (!res.ok) return false;
      await refresh();
      setIsOpen(true);
      return true;
    },
    [refresh],
  );

  const removeItem = useCallback(
    async (key: string) => {
      await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      await refresh();
    },
    [refresh],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CartContext.Provider
      value={{
        cart,
        count: cart?.items_count ?? 0,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        refresh,
        addItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
