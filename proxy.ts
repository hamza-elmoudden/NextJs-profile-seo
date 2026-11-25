import { NextResponse, type NextRequest } from "next/server";

// Legacy blog filter URLs (/blog?category=x) moved to real category pages
// (/blog/x). Redirect here rather than in the page: /blog is ISR-cached (the
// page can't see searchParams per request), and next.config redirects would
// carry ?category= along.
export function proxy(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  if (!category || category === "all") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/blog/${encodeURIComponent(category)}`;
  url.searchParams.delete("category");
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: "/blog",
};
