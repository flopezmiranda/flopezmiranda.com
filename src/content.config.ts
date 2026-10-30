import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['Marketing', 'Datos', 'IA']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** Enlace a la publicación original en LinkedIn */
    originalUrl: z.string().url().optional(),
    /** Serie a la que pertenece (por ejemplo, la newsletter) */
    series: z.string().optional(),
    edition: z.number().optional(),
  }),
});

export const collections = { blog };
