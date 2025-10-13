import React, { useState } from 'react';
import { Clock, CheckCircle, CreditCard as Edit3, Save, X, Paperclip, Upload, File, Calendar, Plus, Trash2, User, Check, Bone as XIcon, MessageSquare, BarChart3 } from "lucide-react";
import type { Project, Phase, PhaseReviewer } from "../../types/project";
import type { User as UserType, UserRole } from "../../types/user";
import CommentSection from "../CommentSection";
import FileUpload from "../FileUpload";
import GanttChart from "./GanttChart";
import { ROLE_PERMISSIONS } from "../../types/user";
import { useLanguage } from "../../hooks/useLanguage";

interface Props {
  project: Project;
  currentUser: UserType;
  userRole: UserRole;
  comments: Record<string, any[]>;
  onAddComment: (section: string) => (content: string, attachments?: File[]) => void;
  onReply: (section: string) => (commentId: string, content: string) => void;
  onUpdatePhase?: (phaseIndex: number, updates: any) => void;
  onAddPhaseAttachment?: (phaseIndex: number, file: File) => void;
  onAddPhase?: () => void;
  onDeletePhase?: (phaseIndex: number) => void;
}

const ALL_ROLES = [
  'designer',
  'product-manager-1',
  'product-manager-2', 
  'product-manager-3',
  'sponsor',
  'operator-1',
  'operator-2',
  'operator-3'
];

const ROLE_LABELS = {
  'designer': 'role.designer',
  'product-manager-1': 'role.productManager1',
  'product-manager-2': 'role.productManager2',
  'product-manager-3': 'role.productManager3',
  'sponsor': 'role.sponsor',
  'operator-1': 'role.operator1',
  'operator-2': 'role.operator2',
  'operator-3': 'role.operator3',
};

export default function TimelinePanel({
  project, currentUser, userRole, comments, onAddComment, onReply, onUpdatePhase, onAddPhaseAttachment, onAddPhase, onDeletePhase
}: Props) {
  const sectionKey = `${project.id}:timeline`;
  const canUpload = ROLE_PERMISSIONS[userRole].canUpload;
  const canComment = ROLE_PERMISSIONS[userRole].canComment;
  const canEdit = ROLE_PERMISSIONS[userRole].canEdit.includes('timeline') || 
                  ['product-manager-1', 'product-manager-2', 'product-manager-3', 'sponsor'].includes(userRole);
  
  const { t } = useLanguage();

  const [editingPhase, setEditingPhase] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Phase>>({});
  const [showGantt, setShowGantt] = useState(true);

  // Calculate duration between two dates
  const calculateDuration = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) return '0 days';
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      const remainingDays = diffDays % 7;
      if (remainingDays === 0) {
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
      } else {
        return `${weeks} week${weeks !== 1 ? 's' : ''} ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
      }
    } else {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      if (remainingDays === 0) {
        return `${months} month${months !== 1 ? 's' : ''}`;
      } else {
        return `${months} month${months !== 1 ? 's' : ''} ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
      }
    }
  };

  const handleEditPhase = (phaseIndex: number) => {
    const phase = project.phases[phaseIndex];
    setEditingPhase(phaseIndex);
    setEditData({
      name: phase.name,
      startDate: phase.startDate || '',
      endDate: phase.endDate || '',
      duration: phase.duration,
      content: phase.content || 'Content of Project(New)',
      reviewers: [...(phase.reviewers || [])]
    });
  };

  const handleSavePhase = (phaseIndex: number) => {
    if (onUpdatePhase && editData) {
      // Auto-calculate duration if dates are provided
      let updatedData = { ...editData };
      if (editData.startDate && editData.endDate) {
        updatedData.duration = calculateDuration(editData.startDate, editData.endDate);
      }
      
      onUpdatePhase(phaseIndex, updatedData);
    }
    setEditingPhase(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingPhase(null);
    setEditData({});
  };

  const handleInputChange = (field: keyof Phase, value: any) => {
    setEditData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate duration when dates change
      if ((field === 'startDate' || field === 'endDate') && updated.startDate && updated.endDate) {
        updated.duration = calculateDuration(updated.startDate, updated.endDate);
      }
      
      return updated;
    });
  };

  const handleAddReviewer = (role: string) => {
    const newReviewer: PhaseReviewer = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      status: 'pending',
      comment: '',
    };
    
    setEditData(prev => ({
      ...prev,
      reviewers: [...(prev.reviewers || []), newReviewer]
    }));
  };

  const handleRemoveReviewer = (reviewerId: string) => {
    setEditData(prev => ({
      ...prev,
      reviewers: (prev.reviewers || []).filter(r => r.id !== reviewerId)
    }));
  };

  const handleReviewerStatusChange = (reviewerId: string, status: 'approved' | 'rejected') => {
    setEditData(prev => ({
      ...prev,
      reviewers: (prev.reviewers || []).map(r => 
        r.id === reviewerId 
          ? { ...r, status, reviewedAt: new Date() }
          : r
      )
    }));
  };

  const handleReviewerCommentChange = (reviewerId: string, comment: string) => {
    setEditData(prev => ({
      ...prev,
      reviewers: (prev.reviewers || []).map(r => 
        r.id === reviewerId 
          ? { ...r, comment }
          : r
      )
    }));
  };

  const handleFileUpload = (phaseIndex: number, files: FileList | null) => {
    if (files && files.length > 0 && onAddPhaseAttachment) {
      Array.from(files).forEach(file => {
        onAddPhaseAttachment(phaseIndex, file);
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleDeletePhase = (phaseIndex: number) => {
    if (window.confirm(t('timeline.confirmDelete') || 'Are you sure you want to delete this phase?')) {
      if (onDeletePhase) {
        onDeletePhase(phaseIndex);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowGantt(!showGantt)}
          className={`inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors ${
            showGantt
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BarChart3 className="w-5 h-5 mr-2" />
          {showGantt ? t('timeline.hideGantt') : t('timeline.showGantt')}
        </button>
        {canEdit && (
          <button
            onClick={onAddPhase}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('timeline.addPhase')}
          </button>
        )}
      </div>

      {/* Gantt Chart */}
      {showGantt && (
        <GanttChart phases={project.phases} />
      )}

      {/* Phase Cards */}
      {project.phases.map((phase, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-6 bg-white">
          {editingPhase === i ? (
            // Edit Mode
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-lg font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-700"
                  placeholder={t('timeline.phase') + ' ' + t('common.name')}
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSavePhase(i)}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {t('actions.save')}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t('actions.cancel')}
                  </button>
                </div>
              </div>

              {/* Date and Duration Section */}
              <div className="grid md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('timeline.startDate')}</label>
                  <input
                    type="date"
                    value={editData.startDate || ''}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('timeline.endDate')}</label>
                  <input
                    type="date"
                    value={editData.endDate || ''}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('timeline.duration')}</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editData.duration || ''}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('timeline.autoCalculated')}
                    />
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('timeline.content')}</label>
                <textarea
                  value={editData.content || ''}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder={t('timeline.enterPhaseContent')}
                />
              </div>

              {/* Reviewers Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">{t('timeline.reviewers')}</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddReviewer(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('timeline.addReviewer')}</option>
                    {ALL_ROLES.filter(role => 
                      !(editData.reviewers || []).some(r => r.role === role)
                    ).map(role => (
                      <option key={role} value={role}>
                        {t(ROLE_LABELS[role as keyof typeof ROLE_LABELS])}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  {(editData.reviewers || []).map((reviewer) => (
                    <div key={reviewer.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {t(ROLE_LABELS[reviewer.role as keyof typeof ROLE_LABELS])}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reviewer.status)}`}>
                            {getStatusIcon(reviewer.status)}
                            <span className="ml-1 capitalize">{t(`timeline.status${reviewer.status.charAt(0).toUpperCase() + reviewer.status.slice(1)}`)}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveReviewer(reviewer.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <button
                          onClick={() => handleReviewerStatusChange(reviewer.id, 'approved')}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            reviewer.status === 'approved'
                              ? 'bg-green-600 text-white'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          <Check className="w-4 h-4 inline mr-1" />
                          {t('actions.approve')}
                        </button>
                        <button
                          onClick={() => handleReviewerStatusChange(reviewer.id, 'rejected')}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            reviewer.status === 'rejected'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          {t('actions.reject')}
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">{t('timeline.comment')}</label>
                        <textarea
                          value={reviewer.comment}
                          onChange={(e) => handleReviewerCommentChange(reviewer.id, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={2}
                          placeholder={t('timeline.addReviewComment')}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Phase {i + 1}: {phase.name}
                </h3>
                {canEdit && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditPhase(i)}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePhase(i)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Date and Duration Display */}
              <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">{t('timeline.startDate')}</div>
                    <div className="text-sm font-medium">
                      {phase.startDate ? new Date(phase.startDate).toLocaleDateString() : t('timeline.notSet')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">{t('timeline.endDate')}</div>
                    <div className="text-sm font-medium">
                      {phase.endDate ? new Date(phase.endDate).toLocaleDateString() : t('timeline.notSet')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">{t('timeline.duration')}</div>
                    <div className="text-sm font-medium">{phase.duration}</div>
                  </div>
                </div>
              </div>

              {/* Content Display */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{t('timeline.content')}</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {phase.content || t('timeline.phaseContent')}
                  </p>
                </div>
              </div>

              {/* Reviewers Display */}
              {phase.reviewers && phase.reviewers.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">{t('timeline.reviewers')}</h4>
                  <div className="space-y-2">
                    {phase.reviewers.map((reviewer) => (
                      <div key={reviewer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {t(ROLE_LABELS[reviewer.role as keyof typeof ROLE_LABELS])}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reviewer.status)}`}>
                            {getStatusIcon(reviewer.status)}
                            <span className="ml-1 capitalize">{t(`timeline.status${reviewer.status.charAt(0).toUpperCase() + reviewer.status.slice(1)}`)}</span>
                          </span>
                        </div>
                        {reviewer.comment && (
                          <div className="flex items-center text-xs text-gray-500">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {t('timeline.hasComment')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Phase Attachments */}
              {canEdit && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{t('timeline.attachments')}</h4>
                    <label className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors">
                      <Upload className="w-4 h-4 mr-1" />
                      {t('timeline.addFiles')}
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(i, e.target.files)}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.pptx"
                      />
                    </label>
                  </div>
                  
                  {phase.attachments && phase.attachments.length > 0 && (
                    <div className="space-y-2">
                      {phase.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center space-x-3">
                            <File className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(attachment.size)} • {t('timeline.uploadedAt')} {new Date(attachment.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <a
                            href={attachment.url}
                            download={attachment.name}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {t('actions.download')}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {canUpload && (
        <FileUpload section={sectionKey} currentUser={currentUser} onUpload={() => Promise.resolve()} />
      )}

      {canComment && (
        <CommentSection
          section={sectionKey}
          comments={comments[sectionKey] || []}
          currentUser={currentUser}
          onAddComment={onAddComment(sectionKey)}
          onReply={onReply(sectionKey)}
        />
      )}
    </div>
  );
}