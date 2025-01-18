import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { formatBlogPosts } from '../utils/blog';

export async function GET(context) {
  const blog = await getCollection('blog');
  const posts = formatBlogPosts(blog);

  return rss({
    title: 'Your Blog Title',
    description: 'Your blog description',
    site: context.site,
    items: posts,
    customData: `<language>en-us</language>`,
  });
}