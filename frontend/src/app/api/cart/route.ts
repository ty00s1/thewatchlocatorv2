import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP = process.env.WP_API_URL || "http://wordpress";
const COOKIE = "twl_cart_token";

export async function GET() {
  const token = (await cookies()).get(COOKIE)?.value;
  const res = await fetch(`${WP}/wp-json/wc/store/v1/cart`, {
    headers: token ? { "Cart-Token": token } : {},
    cache: "no-store",
  });
  const next = res.headers.get("Cart-Token");
  const body = await res.json();
  const out = NextResponse.json(body, { status: res.status });
  if (next) {
    out.cookies.set(COOKIE, next, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  return out;
}
