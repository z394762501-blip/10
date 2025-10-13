import React, { useState } from 'react';
import type { Project, Risk } from "../../types/project";
import type { User, UserRole } from "../../types/user";
import CommentSection from "../CommentSection";
import FileUpload from "../FileUpload";
import { ROLE_PERMISSIONS } from "../../types/user";
import { AlertTriangle, Plus, CreditCard as Edit3, Save, X, Trash2 } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function badge(level: string) {
  switch (level) {
    case 'High': return 'text-red-600 bg-red-100';
    case 'Medium': return 'text-amber-600 bg-amber-100';
    case 'Low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

interface Props {
  project: Project;
  currentUser: User;
  userRole: UserRole;
  comments: Record<string, any[]>;
  onAddComment: (section: string) => (content: string, attachments?: File[]) => void;
  onReply: (section: string) => (commentId: string, content: string) => void;
  onAddRisk?: (risk: Risk) => void;
  onUpdateRisk?: (riskIndex: number, risk: Risk) => void;
  onDeleteRisk?: (riskIndex: number) => void;
}

export default function RisksPanel({
  project, currentUser, userRole, comments, onAddComment, onReply, 
  onAddRisk, onUpdateRisk, onDeleteRisk
}: Props) {
  const sectionKey = `${project.id}:risks`;
  const canUpload = ROLE_PERMISSIONS[userRole].canUpload;
  const canComment = ROLE_PERMISSIONS[userRole].canComment;
  const canEdit = ROLE_PERMISSIONS[userRole].canEdit.includes('risks') || 
                  ['product-manager-1', 'product-manager-2', 'product-manager-3', 'sponsor'].includes(userRole);

  const { t } = useLanguage();

  const [editingRisk, setEditingRisk] = useState<number | null>(null);
  const [addingRisk, setAddingRisk] = useState(false);
  const [riskData, setRiskData] = useState<Risk>({
    category: '',
    description: '',
    impact: 'Medium',
    probability: 'Medium',
    mitigation: ''
  });

  const handleEditRisk = (index: number) => {
    setRiskData(project.risks[index]);
    setEditingRisk(index);
  };

  const handleAddRisk = () => {
    setRiskData({
      category: '',
      description: '',
      impact: 'Medium',
      probability: 'Medium',
      mitigation: ''
    });
    setAddingRisk(true);
  };

  const handleSaveRisk = () => {
    if (addingRisk && onAddRisk) {
      onAddRisk(riskData);
      setAddingRisk(false);
    } else if (editingRisk !== null && onUpdateRisk) {
      onUpdateRisk(editingRisk, riskData);
      setEditingRisk(null);
    }
    setRiskData({
      category: '',
      description: '',
      impact: 'Medium',
      probability: 'Medium',
      mitigation: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingRisk(null);
    setAddingRisk(false);
    setRiskData({
      category: '',
      description: '',
      impact: 'Medium',
      probability: 'Medium',
      mitigation: ''
    });
  };

  const handleDeleteRisk = (index: number) => {
    if (onDeleteRisk && confirm('Are you sure you want to delete this risk?')) {
      onDeleteRisk(index);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">{t('risks.riskManagement')}</h3>
        </div>
        {canEdit && (
          <button
            onClick={handleAddRisk}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t('risks.addRisk')}
          </button>
        )}
      </div>

      {/* Add Risk Form */}
      {addingRisk && (
        <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">{t('risks.addNewRiskTitle')}</h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveRisk}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('risks.category')}</label>
              <input
                type="text"
                value={riskData.category}
                onChange={(e) => setRiskData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('risks.categoryPlaceholder')}
              />
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('risks.impact')}</label>
                <select
                  value={riskData.impact}
                  onChange={(e) => setRiskData(prev => ({ ...prev, impact: e.target.value as 'High' | 'Medium' | 'Low' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="High">{t('risks.high')}</option>
                  <option value="Medium">{t('risks.medium')}</option>
                  <option value="Low">{t('risks.low')}</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('risks.probability')}</label>
                <select
                  value={riskData.probability}
                  onChange={(e) => setRiskData(prev => ({ ...prev, probability: e.target.value as 'High' | 'Medium' | 'Low' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="High">{t('risks.high')}</option>
                  <option value="Medium">{t('risks.medium')}</option>
                  <option value="Low">{t('risks.low')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('risks.description')}</label>
            <textarea
              value={riskData.description}
              onChange={(e) => setRiskData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder={t('risks.descriptionPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('risks.mitigation')}</label>
            <textarea
              value={riskData.mitigation}
              onChange={(e) => setRiskData(prev => ({ ...prev, mitigation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder={t('risks.mitigationPlaceholder')}
            />
          </div>
        </div>
      )}

      {/* Existing Risks */}
      {project.risks.map((risk, idx) => (
        <div key={idx} className="border border-gray-200 rounded-lg p-6">
          {editingRisk === idx ? (
            // Edit Mode
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">{t('risks.editRiskTitle')}</h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveRisk}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('risks.category')}</label>
                  <input
                    type="text"
                    value={riskData.category}
                    onChange={(e) => setRiskData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('risks.impact')}</label>
                    <select
                      value={riskData.impact}
                      onChange={(e) => setRiskData(prev => ({ ...prev, impact: e.target.value as 'High' | 'Medium' | 'Low' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="High">{t('risks.high')}</option>
                      <option value="Medium">{t('risks.medium')}</option>
                      <option value="Low">{t('risks.low')}</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('risks.probability')}</label>
                    <select
                      value={riskData.probability}
                      onChange={(e) => setRiskData(prev => ({ ...prev, probability: e.target.value as 'High' | 'Medium' | 'Low' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="High">{t('risks.high')}</option>
                      <option value="Medium">{t('risks.medium')}</option>
                      <option value="Low">{t('risks.low')}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('risks.description')}</label>
                <textarea
                  value={riskData.description}
                  onChange={(e) => setRiskData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('risks.mitigation')}</label>
                <textarea
                  value={riskData.mitigation}
                  onChange={(e) => setRiskData(prev => ({ ...prev, mitigation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{risk.category} {t('risks.risk')}</h4>
                  <p className="text-gray-700">{risk.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge(risk.impact)}`}>
                    {t('risks.impactLabel')} {t(`risks.${risk.impact.toLowerCase()}`)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge(risk.probability)}`}>
                    {t('risks.probabilityLabel')} {t(`risks.${risk.probability.toLowerCase()}`)}
                  </span>
                  {canEdit && (
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => handleEditRisk(idx)}
                        className="text-gray-400 hover:text-blue-600 p-1 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRisk(idx)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <h5 className="text-sm font-medium text-gray-900 mb-1">{t('risks.mitigationLabel')}</h5>
                <p className="text-sm text-gray-700">{risk.mitigation}</p>
              </div>
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