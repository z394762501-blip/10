import React, { useState } from 'react';
import type { Project, Budget } from "../../types/project";
import type { User, UserRole } from "../../types/user";
import CommentSection from "../CommentSection";
import FileUpload from "../FileUpload";
import { ROLE_PERMISSIONS } from "../../types/user";
import { Users, DollarSign, CreditCard as Edit3, Save, X, CheckCircle } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

interface Props {
  project: Project;
  currentUser: User;
  userRole: UserRole;
  comments: Record<string, any[]>;
  onAddComment: (section: string) => (content: string, attachments?: File[]) => void;
  onReply: (section: string) => (commentId: string, content: string) => void;
  onUpdateBudget?: (budget: Budget) => void;
}

export default function ResourcesPanel({
  project, currentUser, userRole, comments, onAddComment, onReply, onUpdateBudget
}: Props) {
  const sectionKey = `${project.id}:resources`;
  const canUpload = ROLE_PERMISSIONS[userRole].canUpload;
  const canComment = ROLE_PERMISSIONS[userRole].canComment;
  const canEdit = ROLE_PERMISSIONS[userRole].canEdit.includes('resources') || 
                  ['product-manager-1', 'product-manager-2', 'product-manager-3', 'sponsor'].includes(userRole);
  
  const { t } = useLanguage();

  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetData, setBudgetData] = useState<Budget>(project.budget || {
    personnelCosts: 0,
    technologyTools: 0,
    marketingLaunch: 0,
    contingency: 0
  });

  const handleEditBudget = () => {
    setBudgetData(project.budget || {
      personnelCosts: 0,
      technologyTools: 0,
      marketingLaunch: 0,
      contingency: 0
    });
    setEditingBudget(true);
  };

  const handleSaveBudget = () => {
    if (onUpdateBudget) {
      onUpdateBudget(budgetData);
    }
    setEditingBudget(false);
  };

  const handleCancelBudget = () => {
    setEditingBudget(false);
    setBudgetData(project.budget || {
      personnelCosts: 0,
      technologyTools: 0,
      marketingLaunch: 0,
      contingency: 0
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalBudget = budgetData.personnelCosts + budgetData.technologyTools + 
                     budgetData.marketingLaunch + budgetData.contingency;

  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Team Structure & Roles</h3>
      </div>
      <div className="grid gap-4">
        {project.teamMembers.map((m, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{m.role}</h4>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{m.allocation}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {m.responsibilities.map((r, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                  <CheckCircle className="w-3 h-3 inline mr-1" />{r}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Budget Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">{t('resources.projectBudget')}</h3>
          </div>
          {canEdit && !editingBudget && (
            <button
              onClick={handleEditBudget}
              className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          )}
          {editingBudget && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveBudget}
                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-1" />
                {t('actions.save')}
              </button>
              <button
                onClick={handleCancelBudget}
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
              >
                <X className="w-4 h-4 mr-1" />
                {t('actions.cancel')}
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            {editingBudget ? (
              <div className="space-y-2">
                <input
                  type="number"
                  value={budgetData.personnelCosts}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, personnelCosts: Number(e.target.value) }))}
                  className="w-full text-center text-2xl font-bold text-blue-700 bg-transparent border-b-2 border-blue-300 focus:outline-none focus:border-blue-500"
                />
                <div className="text-sm text-gray-600">{t('resources.personnelCosts')}</div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-700">{formatCurrency(budgetData.personnelCosts)}</div>
                <div className="text-sm text-gray-600">{t('resources.personnelCosts')}</div>
              </>
            )}
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            {editingBudget ? (
              <div className="space-y-2">
                <input
                  type="number"
                  value={budgetData.technologyTools}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, technologyTools: Number(e.target.value) }))}
                  className="w-full text-center text-2xl font-bold text-green-700 bg-transparent border-b-2 border-green-300 focus:outline-none focus:border-green-500"
                />
                <div className="text-sm text-gray-600">{t('resources.technologyTools')}</div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-700">{formatCurrency(budgetData.technologyTools)}</div>
                <div className="text-sm text-gray-600">{t('resources.technologyTools')}</div>
              </>
            )}
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            {editingBudget ? (
              <div className="space-y-2">
                <input
                  type="number"
                  value={budgetData.marketingLaunch}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, marketingLaunch: Number(e.target.value) }))}
                  className="w-full text-center text-2xl font-bold text-purple-700 bg-transparent border-b-2 border-purple-300 focus:outline-none focus:border-purple-500"
                />
                <div className="text-sm text-gray-600">{t('resources.marketingLaunch')}</div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-purple-700">{formatCurrency(budgetData.marketingLaunch)}</div>
                <div className="text-sm text-gray-600">{t('resources.marketingLaunch')}</div>
              </>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            {editingBudget ? (
              <div className="space-y-2">
                <input
                  type="number"
                  value={budgetData.contingency}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, contingency: Number(e.target.value) }))}
                  className="w-full text-center text-2xl font-bold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-gray-500"
                />
                <div className="text-sm text-gray-600">{t('resources.contingency')}</div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-700">{formatCurrency(budgetData.contingency)}</div>
                <div className="text-sm text-gray-600">{t('resources.contingency')}</div>
              </>
            )}
          </div>
        </div>

        {/* Total Budget */}
        <div className="bg-indigo-50 p-4 rounded-lg text-center border-2 border-indigo-200">
          <div className="text-3xl font-bold text-indigo-700">{formatCurrency(totalBudget)}</div>
          <div className="text-sm text-gray-600 font-medium">{t('resources.totalBudget')}</div>
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