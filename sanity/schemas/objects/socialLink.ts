import { defineField, defineType } from "sanity";

export const SOCIAL_PLATFORMS = [
  { title: "GitHub", value: "github" },
  { title: "LinkedIn", value: "linkedin" },
  { title: "X (Twitter)", value: "x" },
  { title: "YouTube", value: "youtube" },
  { title: "Instagram", value: "instagram" },
  { title: "Facebook", value: "facebook" },
  { title: "Dev.to", value: "devto" },
  { title: "Medium", value: "medium" },
  { title: "Hashnode", value: "hashnode" },
  { title: "Stack Overflow", value: "stackoverflow" },
  { title: "Website", value: "website" },
  { title: "Other", value: "other" },
] as const;

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: { list: [...SOCIAL_PLATFORMS], layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Optional display label; defaults to the platform name",
    }),
  ],
  preview: {
    select: { platform: "platform", url: "url", label: "label" },
    prepare({ platform, url, label }) {
      return {
        title: label ?? (platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Social Link"),
        subtitle: url,
      };
    },
  },
});
