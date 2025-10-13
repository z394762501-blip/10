import React, { useState } from 'react';
import { MessageSquare, Send, Paperclip, Reply, MoreVertical } from 'lucide-react';
import { Comment, User, UserRole } from '../types/user';

interface CommentSectionProps {
  section: string;
  comments: Comment[];
  currentUser: User;
  onAddComment: (content: string, attachments?: File[]) => void;
  onReply: (commentId: string, content: string) => void;
}

const ROLE_COLORS = {
  'designer': 'bg-purple-100 text-purple-800',
  'product-manager-1': 'bg-blue-100 text-blue-800',
  'product-manager-2': 'bg-blue-100 text-blue-800',
  'product-manager-3': 'bg-blue-100 text-blue-800',
  'sponsor': 'bg-green-100 text-green-800',
  'operator-1': 'bg-amber-100 text-amber-800',
  'operator-2': 'bg-amber-100 text-amber-800',
  'operator-3': 'bg-amber-100 text-amber-800',
};

export default function CommentSection({ 
  section, 
  comments, 
  currentUser, 
  onAddComment, 
  onReply 
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment, attachments);
      setNewComment('');
      setAttachments([]);
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReply(commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-6">
      <div className="flex items-center mb-4">
        <MessageSquare className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment or feedback..."
            className="w-full resize-none border-0 focus:ring-0 focus:outline-none"
            rows={3}
          />
          
          {attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {file.name}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer text-gray-500 hover:text-gray-700">
                <Paperclip className="w-4 h-4" />
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-1" />
              Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {comment.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{comment.userName}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ROLE_COLORS[comment.userRole]}`}>
                      {comment.userRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-gray-700 mb-3">{comment.content}</p>
            
            {comment.attachments && comment.attachments.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {comment.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200"
                    >
                      <Paperclip className="w-3 h-3 mr-1" />
                      {attachment.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <Reply className="w-4 h-4 mr-1" />
                Reply
              </button>
            </div>
            
            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-3 ml-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full resize-none border-0 bg-transparent focus:ring-0 focus:outline-none"
                    rows={2}
                  />
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim()}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-6 mt-3 space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {reply.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="font-medium text-sm text-gray-900">{reply.userName}</div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${ROLE_COLORS[reply.userRole]}`}>
                        {reply.userRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(reply.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}