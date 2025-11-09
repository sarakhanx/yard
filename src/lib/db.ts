import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize SQLite database
const dbPath = join(process.cwd(), 'blog.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export interface Comment {
  id?: number;
  post_slug: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at?: string;
}

export interface Post {
  id?: number;
  slug: string;
  title: string;
  content: string;
  author_id: string;
  created_at?: string;
  updated_at?: string;
}

// Comments operations
export const getComments = (postSlug: string): Comment[] => {
  const stmt = db.prepare('SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC');
  return stmt.all(postSlug) as Comment[];
};

export const addComment = (comment: Comment): Comment => {
  const stmt = db.prepare(`
    INSERT INTO comments (post_slug, user_id, user_name, user_avatar, content)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    comment.post_slug,
    comment.user_id,
    comment.user_name,
    comment.user_avatar || null,
    comment.content
  );
  return { ...comment, id: result.lastInsertRowid as number };
};

export const deleteComment = (id: number, userId: string): boolean => {
  const stmt = db.prepare('DELETE FROM comments WHERE id = ? AND user_id = ?');
  const result = stmt.run(id, userId);
  return result.changes > 0;
};

// Posts operations
export const getPosts = (): Post[] => {
  const stmt = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
  return stmt.all() as Post[];
};

export const getPost = (slug: string): Post | undefined => {
  const stmt = db.prepare('SELECT * FROM posts WHERE slug = ?');
  return stmt.get(slug) as Post | undefined;
};

export const createPost = (post: Post): Post => {
  const stmt = db.prepare(`
    INSERT INTO posts (slug, title, content, author_id)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(post.slug, post.title, post.content, post.author_id);
  return { ...post, id: result.lastInsertRowid as number };
};

export const updatePost = (slug: string, post: Partial<Post>): boolean => {
  const stmt = db.prepare(`
    UPDATE posts 
    SET title = COALESCE(?, title),
        content = COALESCE(?, content),
        updated_at = CURRENT_TIMESTAMP
    WHERE slug = ?
  `);
  const result = stmt.run(post.title, post.content, slug);
  return result.changes > 0;
};

export const deletePost = (slug: string, authorId: string): boolean => {
  const stmt = db.prepare('DELETE FROM posts WHERE slug = ? AND author_id = ?');
  const result = stmt.run(slug, authorId);
  return result.changes > 0;
};

export default db;
