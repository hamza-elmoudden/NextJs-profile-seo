"use client";

import { usePathname } from "next/navigation";
import Terminal from "@/components/terminal";

export default function PathTerminal() {
  const pathname = usePathname();
  const path = pathname.replace(/^\//, "") || "unknown";

  return (
    <div className="hero-reveal reveal-d1 w-full">
      <Terminal title="hamza@prod: ~">
        <span className="text-amber">$</span> <span className="text-cream">GET</span>{" "}
        <span className="text-screen">/{path}</span>
        {"\n"}
        <span className="text-danger">Error 404</span> — route not found
        {"\n"}
        <span className="text-screen">hint:</span> this path doesn&apos;t exist on the server
        {"\n"}
        <span className="text-terminal">suggest:</span> navigate to / or /about
        {"\n"}
        <span className="text-amber">$</span> <span className="cursor-blink" />
      </Terminal>
    </div>
  );
}