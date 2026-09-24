import { sanityClient } from "@/lib/sanity";

export interface HomePage {
  jsonLd: string | null;
}

export const GET_HOME_PAGE = `*[_type == "homePage"][0] {
  jsonLd
}`;

const HOME_FETCH_OPTIONS = {
  cache: "force-cache" as const,
  next: { revalidate: 1800, tags: ["home"] as string[] },
};

export async function getHomePage(): Promise<HomePage | null> {
  return sanityClient.fetch<HomePage | null>(GET_HOME_PAGE, {}, HOME_FETCH_OPTIONS);
}
