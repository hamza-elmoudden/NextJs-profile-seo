import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework via the `X-Powered-By: Next.js` header.
  poweredByHeader: false,
  experimental: {
    // Inline the (small, Tailwind) CSS as <style> in <head> instead of a
    // render-blocking <link rel="stylesheet">, removing it from the critical path.
    inlineCss: true,
  },
};

export default nextConfig;
