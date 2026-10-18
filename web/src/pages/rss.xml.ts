import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { blogPage, externalPosts, siteMeta } from '../data/content';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const posts = [
    ...(await getCollection('notebooks')).map((post) => ({ ...post.data, path: `${post.data.routePath}/` })),
    ...externalPosts.map((post) => ({ ...post, date: new Date(post.date), path: post.href })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
  const feedUrl = new URL('/rss.xml', siteMeta.siteUrl).toString();
  const blogUrl = new URL('/blog/', siteMeta.siteUrl).toString();

  const items = posts.map((post) => {
    const link = new URL(post.path, siteMeta.siteUrl).toString();
    return [
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      `      <pubDate>${post.date.toUTCString()}</pubDate>`,
      `      <description>${escapeXml(post.description)}</description>`,
      ...post.categories.map((category) => `      <category>${escapeXml(category)}</category>`),
      '    </item>',
    ].join('\n');
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(`${siteMeta.name} · Blog`)}</title>`,
    `    <link>${blogUrl}</link>`,
    `    <description>${escapeXml(blogPage.description)}</description>`,
    '    <language>en</language>',
    `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    ...items,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new Response(`${body}\n`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
