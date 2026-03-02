import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';

export async function GET(context: any) {
  const blog = await getCollection('blog');
  
  return rss({
    title: site.name,
    description: site.description,
    site: context.site || 'https://irisnikita.com', // Replace with real domain when live
    items: blog
      .filter((post) => !post.data.draft)
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
      })),
    customData: `<language>en-us</language>`,
  });
}
