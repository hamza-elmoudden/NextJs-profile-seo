import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework via the `X-Powered-By: Next.js` header.
  poweredByHeader: false,
};

export default nextConfig;
