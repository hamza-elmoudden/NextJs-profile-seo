import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  apiVersion: "2026-09-22",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});
