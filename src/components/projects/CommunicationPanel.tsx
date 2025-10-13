import React, { useState } from 'react';
import type { Project, Communication } from "../../types/project";
import type { User, UserRole } from "../../types/user";
import CommentSection from "../CommentSection";
import FileUpload from "../FileUpload";
import { ROLE_PERMISSIONS } from "../../types/user";
import { Calendar, MessageSquare, CreditCard as Edit3, Save, X, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

interface Props {
  project: Project;
  currentUser: User;
  userRole: UserRole;
  comments: Record<string, any[]>;
  onAddComment: (section: string) => (content: string, attachments?: File[]) => void;
  onReply: (section: string) => (commentId: string, content: string) => void;
  onUpdateCommunication?: (communication: Communication) => void;
}

export default function CommunicationPanel({
  project, currentUser, userRole, comments, onAddComment, onReply, onUpdateCommunication
}: Props) {
  const sectionKey = `${project.id}:communication`;
  const canUpload = ROLE_PERMISSIONS[userRole].canUpload;
  const canComment = ROLE_PERMISSIONS[userRole].canComment;
  const canEdit = ROLE_PERMISSIONS[userRole].canEdit.includes('communication') || 
                  ['product-manager-1', 'product-manager-2', 'product-manager-3', 'sponsor'].includes(userRole);

  const { t } = useLanguage();

  const [editingMeeting, setEditingMeeting] = useState<number | null>(null);
  const [addingMeeting, setAddingMeeting] = useState(false);
  const [meetingData, setMeetingData] = useState({
    title: '',
    schedule: '',
    audience: '',
    content: ''
  });

  const [communicationData, setCommunicationData] = useState<Communication>(project.communication);

  const handleEditMeeting = (index: number) => {
    const meeting = project.communication.meetings[index];
    setMeetingData(meeting);
    setEditingMeeting(index);
  };

  const handleAddMeeting = () => {
    setMeetingData({
      title: '',
      schedule: '',
      audience: '',
      content: ''
    });
    setAddingMeeting(true);
  };

  const handleSaveMeeting = () => {
    let updatedMeetings = [...communicationData.meetings];
    
    if (addingMeeting) {
      updatedMeetings.push(meetingData);
      setAddingMeeting(false);
    } else if (editingMeeting !== null) {
      updatedMeetings[editingMeeting] = meetingData;
      setEditingMeeting(null);
    }

    const updatedCommunication = {
      ...communicationData,
      meetings: updatedMeetings
    };

    setCommunicationData(updatedCommunication);
    if (onUpdateCommunication) {
      onUpdateCommunication(updatedCommunication);
    }

    setMeetingData({
      title: '',
      schedule: '',
      audience: '',
      content: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingMeeting(null);
    setAddingMeeting(false);
    setMeetingData({
      title: '',
      schedule: '',
      audience: '',
      content: ''
    });
  };

  const handleDeleteMeeting = (index: number) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      const updatedMeetings = communicationData.meetings.filter((_, i) => i !== index);
      const updatedCommunication = {
        ...communicationData,
        meetings: updatedMeetings
      };
      
      setCommunicationData(updatedCommunication);
      if (onUpdateCommunication) {
        onUpdateCommunication(updatedCommunication);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Stakeholders</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.communication.stakeholders.map((s, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">{s}</span>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
           <h3 className="text-lg font-semibold">{t('communication.meetings')}</h3>
          </div>
          {canEdit && (
            <button
              onClick={handleAddMeeting}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
             {t('communication.addMeeting')}
            </button>
          )}
        </div>

        {/* Add Meeting Form */}
        {addingMeeting && (
          <div className="border border-blue-200 rounded-lg p-6 bg-blue-50 mb-4">
            <div className="flex items-center justify-between mb-4">
             <h4 className="font-semibold text-gray-900">{t('communication.addNewMeetingTitle')}</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveMeeting}
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

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">{t('communication.meetingTitle')}</label>
                <input
                  type="text"
                  value={meetingData.title}
                  onChange={(e) => setMeetingData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder={t('communication.titlePlaceholder')}
                />
              </div>
              <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">{t('communication.schedule')}</label>
                <input
                  type="text"
                  value={meetingData.schedule}
                  onChange={(e) => setMeetingData(prev => ({ ...prev, schedule: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder={t('communication.schedulePlaceholder')}
                />
              </div>
            </div>

            <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">{t('communication.audience')}</label>
              <input
                type="text"
                value={meetingData.audience}
                onChange={(e) => setMeetingData(prev => ({ ...prev, audience: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder={t('communication.audiencePlaceholder')}
              />
            </div>

            <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">{t('communication.meetingContent')}</label>
              <textarea
                value={meetingData.content}
                onChange={(e) => setMeetingData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
               placeholder={t('communication.contentPlaceholder')}
              />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {communicationData.meetings.map((m, i) => (
            <div key={i} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              {editingMeeting === i ? (
                // Edit Mode
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{t('communication.editMeetingTitle')}</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveMeeting}
                        className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        {t('actions.save')}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200"
                      >
                        <X className="w-3 h-3 mr-1" />
                        {t('actions.cancel')}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t('communication.meetingTitle')}</label>
                      <input
                        type="text"
                        value={meetingData.title}
                        onChange={(e) => setMeetingData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t('communication.schedule')}</label>
                      <input
                        type="text"
                        value={meetingData.schedule}
                        onChange={(e) => setMeetingData(prev => ({ ...prev, schedule: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t('communication.audience')}</label>
                      <input
                        type="text"
                        value={meetingData.audience}
                        onChange={(e) => setMeetingData(prev => ({ ...prev, audience: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t('communication.meetingContent')}</label>
                      <textarea
                        value={meetingData.content}
                        onChange={(e) => setMeetingData(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{m.title}</h4>
                      <p className="text-sm text-gray-600">{m.schedule}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-blue-700">{m.audience}</span>
                      {canEdit && (
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={() => handleEditMeeting(i)}
                            className="text-gray-400 hover:text-blue-600 p-1 rounded"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteMeeting(i)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {m.content && (
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <h5 className="text-xs font-medium text-gray-700 mb-1">{t('communication.meetingContentLabel')}</h5>
                      <p className="text-sm text-gray-600">{m.content}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

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