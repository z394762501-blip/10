import React, { useState } from 'react';
import { FolderOpen, Plus, Calendar, Users, AlertTriangle, CreditCard as Edit, Trash2, BarChart3 } from 'lucide-react';
import { Project } from '../types/project';
import { User, UserRole, ROLE_PERMISSIONS } from '../types/user';
import ProjectCreationModal from './ProjectCreationModal';
import { useLanguage } from '../hooks/useLanguage';

interface ProjectListProps {
  projects: Project[];
  currentUser: User;
  onSelectProject: (project: Project) => void;
  onCreateProject: (name: string, createdBy: User) => void;
  onDeleteProject: (projectId: string) => void;
  onShowUserManagement?: () => void;
  onShowOverview?: () => void;
}


export default function ProjectList({
  projects,
  currentUser,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onShowUserManagement,
  onShowOverview
}: ProjectListProps) {
  console.log('currentUser:', currentUser, 'projects:', projects); // ← 放这里
  if (!currentUser) {
    return null;
  }
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { t } = useLanguage();
  
  const canCreateProjects = [
  'product-manager-1',
  'product-manager-2',
  'product-manager-3',
  'sponsor',
  'admin'
].includes(currentUser.role);

  const isAdmin = currentUser.role === 'admin';
  const handleCreateProject = (name: string, createdBy: User) => {
    onCreateProject(name, createdBy);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('projects.title')}</h1>
          <p className="text-gray-600 mt-1">{t('projects.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-3">
          {projects.length > 0 && onShowOverview && (
            <button
              onClick={onShowOverview}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              {t('projects.overview')}
            </button>
          )}
          {isAdmin && onShowUserManagement && (
            <button
              onClick={onShowUserManagement}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              User Management
            </button>
          )}
          {canCreateProjects && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('projects.newProject')}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectProject(project)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.phases.length} {t('projects.phases')}</p>
                </div>
              </div>
              {canCreateProjects && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit - could open edit modal
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this project?')) {
                        onDeleteProject(project.id);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {project.phases.reduce((total, phase) => {
                    const weeks = parseInt(phase.duration.split(' ')[0]) || 0;
                    return total + weeks;
                  }, 0)} {t('projects.weeksTotal')}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{project.teamMembers.length} {t('projects.teamMembers')}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span>{project.risks.length} {t('projects.risks')}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {project.communication.stakeholders.length} {t('projects.stakeholders')}
                </span>
                <span className="text-xs text-blue-600 font-medium">
                  {t('projects.viewDetails')}
                </span>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('projects.noProjects')}</h3>
            <p className="text-gray-600 mb-4">
              {canCreateProjects 
                ? t('projects.noProjectsDesc')
                : t('projects.noProjectsDescOperator')
              }
            </p>
            {canCreateProjects && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('projects.createProject')}
              </button>
            )}
          </div>
        )}
      </div>

      <ProjectCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={handleCreateProject}
        currentUser={currentUser}
      />
    </div>
  );
}