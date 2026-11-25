import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// 180×180 PNG apple-touch-icon generated from app/icon.svg at build time.
// iOS ignores transparency, so the circle sits on the site's ink background.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const svg = await readFile(join(process.cwd(), "app/icon.svg"));
  const src = `data:image/svg+xml;base64,${svg.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d1012",
        }}
      >
        <img src={src} width={150} height={150} alt="" />
      </div>
    ),
    size,
  );
}
