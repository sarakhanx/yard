import { defineMiddleware } from 'astro:middleware';
import { getSession } from 'auth-astro/server';

export const onRequest = defineMiddleware(async (context, next) => {
  // Protect /auth/blog route - only admin can access
  if (context.url.pathname.startsWith('/auth/blog')) {
    const session = await getSession(context.request);
    
    if (!session?.user) {
      return context.redirect('/auth/signin');
    }
    
    const adminUsername = import.meta.env.ADMIN_GITHUB_USERNAME;
    const userGithubLogin = session.user.name || session.user.email;
    
    if (userGithubLogin !== adminUsername) {
      return context.redirect('/yard');
    }
  }
  
  return next();
});
