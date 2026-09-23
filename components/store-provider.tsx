"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/lib/store";
import type { SiteSettings } from "@/lib/site-settings";

export default function StoreProvider({
  settings,
  children,
}: {
  settings: SiteSettings | null;
  children: ReactNode;
}) {
  const [store] = useState<AppStore>(() => makeStore(settings));

  return <Provider store={store}>{children}</Provider>;
}
