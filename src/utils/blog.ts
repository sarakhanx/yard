import type { CollectionEntry } from 'astro:content';

export function formatBlogPosts(posts: CollectionEntry<'blog'>[]) {
  return posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: post.data.description,
    link: `/blog/${post.slug}/`,
  }));
}