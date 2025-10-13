export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  joinedAt: Date;
  lastActive: Date;
}

export type UserRole = 
  | 'designer' 
  | 'product-manager-1' 
  | 'product-manager-2' 
  | 'product-manager-3' 
  | 'sponsor' 
  | 'operator-1' 
  | 'operator-2' 
  | 'operator-3';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  timestamp: Date;
  section: string;
  attachments?: FileAttachment[];
  replies?: Comment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ProjectUpdate {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  title: string;
  description: string;
  section: string;
  timestamp: Date;
  attachments?: FileAttachment[];
  status: 'draft' | 'published' | 'archived';
}

export const ROLE_PERMISSIONS = {
  'designer': {
    canEdit: ['scope', 'timeline'],
    canComment: true,
    canUpload: true,
    canViewAll: true,
  },
  'product-manager-1': {
    canEdit: ['scope', 'timeline', 'resources', 'communication'],
    canComment: true,
    canUpload: true,
    canViewAll: true,
  },
  'product-manager-2': {
    canEdit: ['scope', 'timeline', 'resources', 'communication'],
    canComment: true,
    canUpload: true,
    canViewAll: true,
  },
  'product-manager-3': {
    canEdit: ['scope', 'timeline', 'resources', 'communication'],
    canComment: true,
    canUpload: true,
    canViewAll: true,
  },
  'sponsor': {
    canEdit: ['scope', 'resources'],
    canComment: true,
    canUpload: true,
    canViewAll: true,
  },
  'operator-1': {
    canEdit: ['timeline', 'risks'],
    canComment: true,
    canUpload: true,
    canViewAll: false,
  },
  'operator-2': {
    canEdit: ['timeline', 'risks'],
    canComment: true,
    canUpload: true,
    canViewAll: false,
  },
  'operator-3': {
    canEdit: ['timeline', 'risks'],
    canComment: true,
    canUpload: true,
    canViewAll: false,
  },
} as const;