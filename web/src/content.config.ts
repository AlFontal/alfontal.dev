import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const notebooks = defineCollection({
  loader: glob({ base: './src/content/notebooks-generated', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()),
    author: z.string(),
    image: z.string(),
    section: z.string(),
    notebook: z.string(),
    routePath: z.string(),
  }),
});

export const collections = {
  notebooks,
};
