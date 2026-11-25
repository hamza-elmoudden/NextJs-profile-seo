import { createClient } from "@sanity/client";
const c = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: "production", apiVersion: "2026-09-22", useCdn: false, token: process.env.SANITY_API_TOKEN });
const q = process.argv[2];
console.log(JSON.stringify(await c.fetch(q), null, 1));
