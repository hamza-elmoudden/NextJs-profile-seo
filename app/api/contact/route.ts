import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

const isValid = (body: Partial<ContactPayload>): body is ContactPayload =>
  typeof body.name === "string" &&
  body.name.trim().length >= 2 &&
  body.name.trim().length <= 100 &&
  typeof body.email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) &&
  typeof body.message === "string" &&
  body.message.trim().length >= 10 &&
  body.message.trim().length <= 5000 &&
  (body.subject === undefined ||
    (typeof body.subject === "string" && body.subject.length <= 200));

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!isValid(body)) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 422 });
  }

  await sanityClient.create({
    _type: "contact",
    name: body.name.trim(),
    email: body.email.trim(),
    subject: body.subject?.trim() || undefined,
    message: body.message.trim(),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
