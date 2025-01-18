import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().optional(),
    description: z.string(),
    slug: z.string(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { blog };