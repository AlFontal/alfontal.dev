import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { navLinks, siteMeta } from '../data/content';

// Pages and posts are served as directories, so every URL ends in a slash to match the canonical tags.
const absoluteUrl = (pathname: string) => new URL(pathname.endsWith('/') ? pathname : `${pathname}/`, siteMeta.siteUrl).toString();

export const GET: APIRoute = async () => {
  const posts = await getCollection('notebooks');
  const entries = [
    ...navLinks.map((link) => ({ loc: absoluteUrl(link.href) })),
    ...posts.map((post) => ({ loc: absoluteUrl(post.data.routePath), lastmod: post.data.date.toISOString().slice(0, 10) })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(({ loc, lastmod }) =>
      lastmod ? `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>` : `  <url><loc>${loc}</loc></url>`,
    ),
    '</urlset>',
  ].join('\n');

  return new Response(`${body}\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
