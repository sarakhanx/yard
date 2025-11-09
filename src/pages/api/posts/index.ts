import type { APIRoute } from 'astro';
import { getPosts, createPost, type Post } from '../../../lib/db';
import { getSession } from 'auth-astro/server';

// Get all posts
export const GET: APIRoute = async () => {
  try {
    const posts = getPosts();
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Create a new post (admin only)
export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  
  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check if user is admin
  const adminUsername = process.env.ADMIN_GITHUB_USERNAME;
  const userGithubLogin = session.user.name || session.user.email;
  
  if (userGithubLogin !== adminUsername) {
    return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { slug, title, content } = await request.json();
    
    if (!slug || !title || !content) {
      return new Response(JSON.stringify({ error: 'Slug, title, and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const post: Post = {
      slug: slug.trim(),
      title: title.trim(),
      content: content.trim(),
      author_id: session.user.id || session.user.email || '',
    };

    const newPost = createPost(post);
    
    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response(JSON.stringify({ error: 'Failed to create post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
