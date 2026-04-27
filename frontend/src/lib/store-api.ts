import { cookies } from "next/headers";
import type { Cart, WPCategory, WPProduct } from "./types";

const SERVER_BASE = process.env.WP_API_URL || "http://wordpress";
const PUBLIC_BASE = process.env.NEXT_PUBLIC_WP_URL || "http://localhost:8081";

const apiBase = () => (typeof window === "undefined" ? SERVER_BASE : PUBLIC_BASE);

type FetchOptions = RequestInit & { revalidate?: number };

async function api<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { revalidate, ...init } = opts;
  const url = `${apiBase()}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    next: revalidate !== undefined ? { revalidate } : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Store API ${res.status} on ${path}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

// ── Catalog (server-side, ISR-friendly) ─────────────────────────────────────

export async function getProducts(params: { per_page?: number; category?: string; search?: string } = {}) {
  const q = new URLSearchParams();
  if (params.per_page) q.set("per_page", String(params.per_page));
  if (params.category) q.set("category", params.category);
  if (params.search) q.set("search", params.search);
  const suffix = q.toString() ? `?${q}` : "";
  return api<WPProduct[]>(`/wp-json/wc/store/v1/products${suffix}`, { revalidate: 60 });
}

export async function getProductBySlug(slug: string) {
  const list = await api<WPProduct[]>(`/wp-json/wc/store/v1/products?slug=${encodeURIComponent(slug)}`, {
    revalidate: 60,
  });
  return list[0] ?? null;
}

export async function getCategories() {
  return api<WPCategory[]>(`/wp-json/wc/store/v1/products/categories?per_page=50`, { revalidate: 300 });
}

// ── Cart (browser-side; uses Cart-Token cookie) ─────────────────────────────

const CART_TOKEN_COOKIE = "twl_cart_token";

export async function getCart(): Promise<Cart> {
  const token = (await cookies()).get(CART_TOKEN_COOKIE)?.value;
  const res = await fetch(`${SERVER_BASE}/wp-json/wc/store/v1/cart`, {
    headers: token ? { "Cart-Token": token } : {},
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`getCart ${res.status}`);
  return res.json();
}
