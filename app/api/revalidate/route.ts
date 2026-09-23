import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  revalidateTag("services", "max");
  revalidateTag("about", "max");
  revalidateTag("posts", "max");
  revalidateTag("projects", "max");

  return NextResponse.json({
    revalidated: true,
    tags: ["services", "about", "posts", "projects"],
  });
}
