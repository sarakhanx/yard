import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  post_slug: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
}

interface CommentsProps {
  postSlug: string;
  isAuthenticated: boolean;
  currentUser?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Comments({ postSlug, isAuthenticated, currentUser }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [postSlug]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments/${postSlug}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        setError('Failed to load comments');
      }
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments/${postSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to post comment');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="comments-section">
      <h2 className="comments-title">Comments ({comments.length})</h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="comment-user-info">
            {currentUser?.image && (
              <img 
                src={currentUser.image} 
                alt="Your avatar" 
                className="comment-avatar"
              />
            )}
            <span className="comment-user-name">
              {currentUser?.name || currentUser?.email || 'Anonymous'}
            </span>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="comment-textarea"
            rows={4}
            disabled={submitting}
          />
          {error && <div className="error-message">{error}</div>}
          <button 
            type="submit" 
            className="comment-submit-btn"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="signin-prompt">
          <p>Please sign in to leave a comment</p>
          <a href="/auth/signin" className="signin-btn">
            Sign in with GitHub
          </a>
        </div>
      )}

      <div className="comments-list">
        {loading ? (
          <div className="loading">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                {comment.user_avatar && (
                  <img 
                    src={comment.user_avatar} 
                    alt={comment.user_name}
                    className="comment-avatar"
                  />
                )}
                <div className="comment-meta">
                  <span className="comment-author">{comment.user_name}</span>
                  <span className="comment-date">{formatDate(comment.created_at)}</span>
                </div>
              </div>
              <div className="comment-content">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
