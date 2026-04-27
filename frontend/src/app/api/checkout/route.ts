import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP = process.env.WP_API_URL || "http://wordpress";
const COOKIE = "twl_cart_token";

export async function POST(req: Request) {
  const data = await req.json();
  const token = (await cookies()).get(COOKIE)?.value;

  const pre = await fetch(`${WP}/wp-json/wc/store/v1/cart`, {
    headers: token ? { "Cart-Token": token } : {},
    cache: "no-store",
  });
  const nonce = pre.headers.get("Nonce") || "";
  const cartToken = pre.headers.get("Cart-Token") || token || "";

  const payload = {
    billing_address: {
      first_name: data.first_name,
      last_name: data.last_name,
      company: "",
      address_1: data.address_1,
      address_2: "",
      city: data.city,
      state: "",
      postcode: data.postcode,
      country: data.country || "GB",
      email: data.email,
      phone: data.phone || "",
    },
    shipping_address: {
      first_name: data.first_name,
      last_name: data.last_name,
      company: "",
      address_1: data.address_1,
      address_2: "",
      city: data.city,
      state: "",
      postcode: data.postcode,
      country: data.country || "GB",
      phone: data.phone || "",
    },
    customer_note: "",
    payment_method: data.payment_method || "bacs",
    payment_data: [],
  };

  const res = await fetch(`${WP}/wp-json/wc/store/v1/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cartToken ? { "Cart-Token": cartToken } : {}),
      ...(nonce ? { Nonce: nonce } : {}),
    },
    body: JSON.stringify(payload),
  });

  const next = res.headers.get("Cart-Token") || cartToken;
  const out = NextResponse.json(await res.json(), { status: res.status });
  if (next) out.cookies.set(COOKIE, next, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return out;
}
