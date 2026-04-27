import { NextResponse } from "next/server";

const WP = process.env.WP_API_URL || "http://wordpress";

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${WP}/wp-json/twl/v1/sell-your-watch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
