import { useState, useEffect } from 'react';
import { Comment, User } from '../types/user';

// Mock comments data
const MOCK_COMMENTS: Record<string, Comment[]> = {
  scope: [
    {
      id: '1',
      userId: 'user1',
      userName: 'Sarah Chen',
      userRole: 'designer',
      content: 'The target market definition looks comprehensive. Should we also consider the European market for Phase 2?',
      timestamp: new Date('2024-12-20T10:30:00'),
      section: 'scope',
      replies: [
        {
          id: '1-1',
          userId: 'user2',
          userName: 'Mike Johnson',
          userRole: 'product-manager-1',
          content: 'Great point! Let\'s add European expansion to our roadmap for Q3 2026.',
          timestamp: new Date('2024-12-20T11:15:00'),
          section: 'scope',
        }
      ]
    }
  ],
  timeline: [
    {
      id: '2',
      userId: 'user3',
      userName: 'Alex Rodriguez',
      userRole: 'operator-1',
      content: 'The development phase timeline seems aggressive. We might need an additional month for integration testing.',
      timestamp: new Date('2024-12-20T14:20:00'),
      section: 'timeline',
    }
  ],
  resources: [],
  risks: [
    {
      id: '3',
      userId: 'user4',
      userName: 'Jennifer Liu',
      userRole: 'sponsor',
      content: 'The budget allocation looks reasonable. Let\'s ensure we have quarterly reviews to track spending.',
      timestamp: new Date('2024-12-20T16:45:00'),
      section: 'risks',
    }
  ],
  communication: []
};

export function useComments() {
  const [comments, setComments] = useState<Record<string, Comment[]>>(MOCK_COMMENTS);

  const addComment = (section: string, content: string, user: User, attachments?: File[]) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content,
      timestamp: new Date(),
      section,
      attachments: attachments?.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedBy: user.id,
        uploadedAt: new Date(),
      })),
    };

    setComments(prev => ({
      ...prev,
      [section]: [newComment, ...(prev[section] || [])]
    }));
  };

  const addReply = (section: string, commentId: string, content: string, user: User) => {
    const reply: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content,
      timestamp: new Date(),
      section,
    };

    setComments(prev => ({
      ...prev,
      [section]: prev[section]?.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...(comment.replies || []), reply] }
          : comment
      ) || []
    }));
  };

  return {
    comments,
    addComment,
    addReply,
  };
}