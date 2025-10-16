import { useState, useEffect } from 'react';
import { Comment, User } from '../types/user';

const STORAGE_KEY = 'comments_data';

export function useComments() {
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const commentsWithDates: Record<string, Comment[]> = {};

        Object.keys(parsed).forEach(section => {
          commentsWithDates[section] = parsed[section].map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp),
            replies: comment.replies?.map((reply: any) => ({
              ...reply,
              timestamp: new Date(reply.timestamp)
            })) || []
          }));
        });

        setComments(commentsWithDates);
      }
    } catch (error) {
      console.error('Failed to load comments from localStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveComments = (updatedComments: Record<string, Comment[]>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedComments));
      setComments(updatedComments);
    } catch (error) {
      console.error('Failed to save comments to localStorage:', error);
    }
  };

  const addComment = async (section: string, content: string, user: User, attachments?: File[]) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content,
      timestamp: new Date(),
      section,
      replies: []
    };

    const updatedComments = { ...comments };
    if (!updatedComments[section]) {
      updatedComments[section] = [];
    }
    updatedComments[section] = [newComment, ...updatedComments[section]];

    saveComments(updatedComments);
  };

  const addReply = async (section: string, commentId: string, content: string, user: User) => {
    const reply: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content,
      timestamp: new Date(),
      section
    };

    const updatedComments = { ...comments };
    if (updatedComments[section]) {
      updatedComments[section] = updatedComments[section].map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      });

      saveComments(updatedComments);
    }
  };

  return {
    comments,
    loading,
    addComment,
    addReply,
  };
}
