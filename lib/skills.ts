import { sanityClient } from "@/lib/sanity";

export type Skill = {
  _id: string;
  name: string;
  slug: string | null;
  category: string | null;
  description: string | null;
  icon: string | null;
  order: number;
  featured: boolean;
};

export const GET_SKILLS = `
  *[_type == "skill"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    category,
    description,
    icon,
    order,
    featured
  }
`;

const SKILLS_FETCH_OPTIONS = {
  cache: "force-cache" as const,
  next: { revalidate: 1800, tags: ["skills"] as string[] },
};

export async function getSkills(): Promise<Skill[]> {
  return sanityClient.fetch<Skill[]>(GET_SKILLS, {}, SKILLS_FETCH_OPTIONS);
}
