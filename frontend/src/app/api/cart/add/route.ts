import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP = process.env.WP_API_URL || "http://wordpress";
const COOKIE = "twl_cart_token";

export async function POST(req: Request) {
  const body = await req.json();
  const token = (await cookies()).get(COOKIE)?.value;

  // WC Store API requires a Nonce for state-changing requests.
  // Prefetch GET /cart to obtain one (and a Cart-Token if we don't have one).
  const pre = await fetch(`${WP}/wp-json/wc/store/v1/cart`, {
    headers: token ? { "Cart-Token": token } : {},
    cache: "no-store",
  });
  const nonce = pre.headers.get("Nonce") || "";
  const cartToken = pre.headers.get("Cart-Token") || token || "";

  const res = await fetch(`${WP}/wp-json/wc/store/v1/cart/add-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cartToken ? { "Cart-Token": cartToken } : {}),
      ...(nonce ? { Nonce: nonce } : {}),
    },
    body: JSON.stringify({ id: body.id, quantity: body.quantity ?? 1 }),
  });

  const next = res.headers.get("Cart-Token") || cartToken;
  const out = NextResponse.json(await res.json(), { status: res.status });
  if (next) {
    out.cookies.set(COOKIE, next, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  return out;
}
