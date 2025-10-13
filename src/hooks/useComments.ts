import { useState, useEffect } from 'react';
import { Comment, User } from '../types/user';
import { supabase } from '../lib/supabase';

export function useComments() {
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);

  // Load comments from Supabase
  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);

      // 获取所有评论（不包含回复）
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // 为每个评论加载回复
      const commentsWithReplies = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: repliesData } = await supabase
            .from('comments')
            .select('*')
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true });

          return {
            id: comment.id,
            userId: comment.user_id,
            userName: comment.user_name,
            userRole: comment.user_role,
            content: comment.content,
            timestamp: new Date(comment.created_at),
            section: comment.section,
            replies: (repliesData || []).map(reply => ({
              id: reply.id,
              userId: reply.user_id,
              userName: reply.user_name,
              userRole: reply.user_role,
              content: reply.content,
              timestamp: new Date(reply.created_at),
              section: reply.section
            }))
          } as Comment;
        })
      );

      // 按section分组
      const grouped = commentsWithReplies.reduce((acc, comment) => {
        if (!acc[comment.section]) {
          acc[comment.section] = [];
        }
        acc[comment.section].push(comment);
        return acc;
      }, {} as Record<string, Comment[]>);

      setComments(grouped);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (section: string, content: string, user: User, attachments?: File[]) => {
    try {
      // 从section中提取project_id (格式: "projectId:section")
      const [projectId, sectionName] = section.includes(':')
        ? section.split(':')
        : ['default', section];

      const commentId = Math.random().toString(36).substr(2, 9);

      const { error } = await supabase
        .from('comments')
        .insert({
          id: commentId,
          project_id: projectId,
          section: section,
          user_id: user.id,
          user_name: user.name,
          user_role: user.role,
          content
        });

      if (error) throw error;

      // 重新加载评论
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const addReply = async (section: string, commentId: string, content: string, user: User) => {
    try {
      // 从section中提取project_id
      const [projectId] = section.includes(':')
        ? section.split(':')
        : ['default', section];

      const replyId = Math.random().toString(36).substr(2, 9);

      const { error } = await supabase
        .from('comments')
        .insert({
          id: replyId,
          project_id: projectId,
          section: section,
          user_id: user.id,
          user_name: user.name,
          user_role: user.role,
          content,
          parent_id: commentId
        });

      if (error) throw error;

      // 重新加载评论
      await loadComments();
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return {
    comments,
    loading,
    addComment,
    addReply,
  };
}
