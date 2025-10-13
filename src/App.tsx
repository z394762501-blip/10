import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import UserProfile from './components/UserProfile';
import ProjectList from './components/ProjectList';
import ProjectOverview from './components/ProjectOverview';
import ProjectCreationModal from './components/ProjectCreationModal';
import UserManagement from './components/UserManagement';
import TimelinePanel from './components/projects/TimelinePanel';
import ResourcesPanel from './components/projects/ResourcesPanel';
import RisksPanel from './components/projects/RisksPanel';
import CommunicationPanel from './components/projects/CommunicationPanel';
import LanguageSelector from './components/LanguageSelector';
import { useAuth } from './hooks/useAuth';
import { useProjects } from './hooks/useProjects';
import { useComments } from './hooks/useComments';
import { useLanguage } from './hooks/useLanguage';
import { Project, User } from './types/project';
import { Calendar, Users, DollarSign, AlertTriangle, MessageSquare, FolderOpen, Settings, BarChart3 } from 'lucide-react';

function App() {
  const { user, login, logout } = useAuth();
  const {
    projects,
    createProject,
    updateProject,
    updatePhase,
    addPhaseAttachment,
    deleteProject,
    updateBudget,
    addRisk,
    updateRisk,
    deleteRisk,
    updateCommunication,
    addPhase,
    deletePhase
  } = useProjects();
  const { comments, addComment, addReply } = useComments();
  const { t } = useLanguage();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'scope' | 'timeline' | 'resources' | 'risks' | 'communication' | 'users'>('scope');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <LoginForm onLogin={login} />
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user.role === 'admin';

  const tabs = [
    { id: 'scope' as const, label: t('nav.projectScope'), icon: FolderOpen },
    { id: 'timeline' as const, label: t('nav.timeline'), icon: Calendar },
    { id: 'resources' as const, label: t('nav.resources'), icon: Users },
    { id: 'risks' as const, label: t('nav.risks'), icon: AlertTriangle },
    { id: 'communication' as const, label: t('nav.communication'), icon: MessageSquare },
  ];

  // Helper functions for comments
  const handleAddComment = (section: string) => (content: string, attachments?: File[]) => {
    addComment(section, content, user, attachments);
  };

  const handleReply = (section: string) => (commentId: string, content: string) => {
    addReply(section, commentId, content, user);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <FolderOpen className="w-8 h-8 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-900">{t('header.projectManagement')}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <UserProfile user={user} onLogout={logout} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showUserManagement && isAdmin ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowUserManagement(false)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  ← Back to Projects
                </button>
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              </div>
            </div>
            <UserManagement currentUser={user} />
          </div>
        ) : showOverview ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowOverview(false)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← {t('header.backToProjects')}
              </button>
            </div>
            <ProjectOverview projects={projects} />
          </div>
        ) : !selectedProject ? (
          <ProjectList
            projects={projects}
            currentUser={user}
            onSelectProject={setSelectedProject}
            onCreateProject={createProject}
            onDeleteProject={deleteProject}
            onShowUserManagement={isAdmin ? () => setShowUserManagement(true) : undefined}
            onShowOverview={() => setShowOverview(true)}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  ← {t('header.backToProjects')}
                </button>
                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          activeTab === tab.id
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'scope' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{t('scope.title')}</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{t('scope.description')}</p>
                      </div>
                    </div>

                    {/* Project Dashboard */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('dashboard.title')}</h3>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-700">{selectedProject.phases.length}</div>
                          <div className="text-sm text-gray-600">{t('dashboard.projectPhases')}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-700">{selectedProject.teamMembers.length}</div>
                          <div className="text-sm text-gray-600">{t('dashboard.teamMembers')}</div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-amber-700">{selectedProject.risks.length}</div>
                          <div className="text-sm text-gray-600">{t('dashboard.riskItems')}</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-700">
                            {selectedProject.phases.reduce((total, phase) => {
                              const weeks = parseInt(phase.duration.split(' ')[0]) || 0;
                              return total + weeks;
                            }, 0)}
                          </div>
                          <div className="text-sm text-gray-600">{t('dashboard.totalWeeks')}</div>
                        </div>
                      </div>

                      {/* Project Timeline Overview */}
                      <div className="mb-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">{t('dashboard.timelineOverview')}</h4>
                        <div className="space-y-2">
                          {selectedProject.phases.map((phase, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-700">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900">{phase.name}</span>
                                  <span className="text-sm text-gray-500">{phase.duration}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${Math.min(100, (index + 1) * 20)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Budget Overview */}
                      {selectedProject.budget && (
                        <div className="mb-6">
                          <h4 className="text-md font-semibold text-gray-900 mb-3">{t('dashboard.budgetOverview')}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600">{t('dashboard.personnelCosts')}</div>
                              <div className="text-lg font-semibold text-gray-900">
                                ${selectedProject.budget.personnelCosts.toLocaleString()}
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600">{t('dashboard.technologyTools')}</div>
                              <div className="text-lg font-semibold text-gray-900">
                                ${selectedProject.budget.technologyTools.toLocaleString()}
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600">{t('dashboard.marketingLaunch')}</div>
                              <div className="text-lg font-semibold text-gray-900">
                                ${selectedProject.budget.marketingLaunch.toLocaleString()}
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600">{t('dashboard.contingency')}</div>
                              <div className="text-lg font-semibold text-gray-900">
                                ${selectedProject.budget.contingency.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                            <div className="text-sm text-gray-600">{t('dashboard.totalBudget')}</div>
                            <div className="text-xl font-bold text-indigo-700">
                              ${(selectedProject.budget.personnelCosts + 
                                 selectedProject.budget.technologyTools + 
                                 selectedProject.budget.marketingLaunch + 
                                 selectedProject.budget.contingency).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Team Overview */}
                      <div className="mb-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">{t('dashboard.teamOverview')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedProject.teamMembers.map((member, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium text-gray-900">{member.role}</div>
                                <div className="text-sm text-gray-600">
                                  {member.responsibilities.slice(0, 2).join(', ')}
                                  {member.responsibilities.length > 2 && '...'}
                                </div>
                              </div>
                              <div className="text-sm font-medium text-blue-600">{member.allocation}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Risk Overview */}
                      {selectedProject.risks.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-md font-semibold text-gray-900 mb-3">{t('dashboard.riskOverview')}</h4>
                          <div className="space-y-2">
                            {selectedProject.risks.slice(0, 3).map((risk, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div>
                                  <div className="font-medium text-gray-900">{risk.category}</div>
                                  <div className="text-sm text-gray-600">{risk.description.substring(0, 60)}...</div>
                                </div>
                                <div className="flex space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    risk.impact === 'High' ? 'bg-red-100 text-red-800' :
                                    risk.impact === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {risk.impact}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {selectedProject.risks.length > 3 && (
                              <div className="text-center text-sm text-gray-500">
                                {t('common.and')} {selectedProject.risks.length - 3} {t('dashboard.moreRisks')}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Communication Overview */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">{t('dashboard.communicationOverview')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">{t('dashboard.regularMeetings')}</div>
                            <div className="space-y-1">
                              {selectedProject.communication.meetings.slice(0, 3).map((meeting, index) => (
                                <div key={index} className="text-sm text-gray-600">
                                  • {meeting.title} - {meeting.schedule}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">
                              {t('dashboard.stakeholders')} ({selectedProject.communication.stakeholders.length})
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {selectedProject.communication.stakeholders.slice(0, 4).map((stakeholder, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {stakeholder}
                                </span>
                              ))}
                              {selectedProject.communication.stakeholders.length > 4 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{selectedProject.communication.stakeholders.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <TimelinePanel
                    project={selectedProject}
                    currentUser={user}
                    userRole={user.role}
                    comments={comments}
                    onAddComment={handleAddComment}
                    onReply={handleReply}
                    onUpdatePhase={(phaseIndex, updates) => updatePhase(selectedProject.id, phaseIndex, updates)}
                    onAddPhaseAttachment={(phaseIndex, file) => addPhaseAttachment(selectedProject.id, phaseIndex, file)}
                    onAddPhase={() => addPhase(selectedProject.id)}
                    onDeletePhase={(phaseIndex) => deletePhase(selectedProject.id, phaseIndex)}
                  />
                )}

                {activeTab === 'resources' && (
                  <ResourcesPanel
                    project={selectedProject}
                    currentUser={user}
                    userRole={user.role}
                    comments={comments}
                    onAddComment={handleAddComment}
                    onReply={handleReply}
                    onUpdateBudget={(budget) => updateBudget(selectedProject.id, budget)}
                  />
                )}

                {activeTab === 'risks' && (
                  <RisksPanel
                    project={selectedProject}
                    currentUser={user}
                    userRole={user.role}
                    comments={comments}
                    onAddComment={handleAddComment}
                    onReply={handleReply}
                    onAddRisk={(risk) => addRisk(selectedProject.id, risk)}
                    onUpdateRisk={(riskIndex, risk) => updateRisk(selectedProject.id, riskIndex, risk)}
                    onDeleteRisk={(riskIndex) => deleteRisk(selectedProject.id, riskIndex)}
                  />
                )}

                {activeTab === 'communication' && (
                  <CommunicationPanel
                    project={selectedProject}
                    currentUser={user}
                    userRole={user.role}
                    comments={comments}
                    onAddComment={handleAddComment}
                    onReply={handleReply}
                    onUpdateCommunication={(communication) => updateCommunication(selectedProject.id, communication)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;