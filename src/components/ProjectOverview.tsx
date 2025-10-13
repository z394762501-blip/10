import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Users,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Project } from '../types/project';
import { useLanguage } from '../hooks/useLanguage';

interface ProjectOverviewProps {
  projects: Project[];
}

export default function ProjectOverview({ projects }: ProjectOverviewProps) {
  const { t } = useLanguage();

  // Calculate overall statistics
  const totalProjects = projects.length;
  const totalPhases = projects.reduce((sum, p) => sum + p.phases.length, 0);
  const totalTeamMembers = projects.reduce((sum, p) => sum + p.teamMembers.length, 0);
  const totalRisks = projects.reduce((sum, p) => sum + p.risks.length, 0);

  const totalBudget = projects.reduce((sum, p) => {
    if (!p.budget) return sum;
    return sum + p.budget.personnelCosts + p.budget.technologyTools +
           p.budget.marketingLaunch + p.budget.contingency;
  }, 0);

  const totalWeeks = projects.reduce((sum, p) => {
    return sum + p.phases.reduce((phaseSum, phase) => {
      const weeks = parseInt(phase.duration.split(' ')[0]) || 0;
      return phaseSum + weeks;
    }, 0);
  }, 0);

  // Risk analysis
  const risksByImpact = projects.reduce((acc, p) => {
    p.risks.forEach(risk => {
      acc[risk.impact] = (acc[risk.impact] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const highRiskProjects = projects.filter(p =>
    p.risks.some(r => r.impact === 'High')
  );

  // Phase completion analysis
  const projectsWithReviewers = projects.map(p => {
    const totalReviewers = p.phases.reduce((sum, phase) => sum + (phase.reviewers?.length || 0), 0);
    const approvedReviewers = p.phases.reduce((sum, phase) => {
      return sum + (phase.reviewers?.filter(r => r.status === 'approved').length || 0);
    }, 0);

    return {
      project: p,
      totalReviewers,
      approvedReviewers,
      completionRate: totalReviewers > 0 ? (approvedReviewers / totalReviewers) * 100 : 0
    };
  });

  // Budget distribution
  const avgBudgetPerProject = totalProjects > 0 ? totalBudget / totalProjects : 0;

  // Timeline analysis
  const avgWeeksPerProject = totalProjects > 0 ? totalWeeks / totalProjects : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('overview.title')}</h1>
        <p className="text-gray-600 mt-1">{t('overview.subtitle')}</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">{t('overview.total')}</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalProjects}</div>
          <div className="text-sm text-gray-600 mt-1">{t('overview.activeProjects')}</div>
          <div className="mt-3 text-xs text-gray-500">
            {totalPhases} {t('overview.totalPhases')}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">{t('overview.budget')}</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${(totalBudget / 1000).toFixed(0)}K
          </div>
          <div className="text-sm text-gray-600 mt-1">{t('overview.totalBudget')}</div>
          <div className="mt-3 text-xs text-gray-500">
            ${(avgBudgetPerProject / 1000).toFixed(0)}K {t('overview.avgPerProject')}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm text-gray-500">{t('overview.risks')}</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalRisks}</div>
          <div className="text-sm text-gray-600 mt-1">{t('overview.identifiedRisks')}</div>
          <div className="mt-3 text-xs text-red-600">
            {risksByImpact['High'] || 0} {t('overview.highImpact')}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">{t('overview.timeline')}</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalWeeks}</div>
          <div className="text-sm text-gray-600 mt-1">{t('overview.totalWeeks')}</div>
          <div className="mt-3 text-xs text-gray-500">
            {avgWeeksPerProject.toFixed(1)} {t('overview.avgWeeksPerProject')}
          </div>
        </div>
      </div>

      {/* Project Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Completion Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('overview.projectCompletionStatus')}
          </h3>
          <div className="space-y-4">
            {projectsWithReviewers.map(({ project, totalReviewers, approvedReviewers, completionRate }) => (
              <div key={project.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{project.name}</span>
                  <span className="text-sm text-gray-500">
                    {completionRate.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      completionRate >= 80 ? 'bg-green-600' :
                      completionRate >= 50 ? 'bg-blue-600' :
                      completionRate >= 30 ? 'bg-amber-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {approvedReviewers} / {totalReviewers} {t('overview.reviewsCompleted')}
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {t('overview.noProjectsYet')}
              </div>
            )}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('overview.riskDistribution')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{t('overview.highRisk')}</div>
                  <div className="text-xs text-gray-500">
                    {highRiskProjects.length} {t('overview.projectsAffected')}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {risksByImpact['High'] || 0}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{t('overview.mediumRisk')}</div>
                  <div className="text-xs text-gray-500">{t('overview.requiresMonitoring')}</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {risksByImpact['Medium'] || 0}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{t('overview.lowRisk')}</div>
                  <div className="text-xs text-gray-500">{t('overview.underControl')}</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {risksByImpact['Low'] || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget & Resource Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Breakdown by Project */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('overview.budgetByProject')}
          </h3>
          <div className="space-y-3">
            {projects.map(project => {
              const projectBudget = project.budget
                ? project.budget.personnelCosts + project.budget.technologyTools +
                  project.budget.marketingLaunch + project.budget.contingency
                : 0;
              const percentage = totalBudget > 0 ? (projectBudget / totalBudget) * 100 : 0;

              return (
                <div key={project.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{project.name}</span>
                    <span className="text-sm text-gray-900 font-semibold">
                      ${(projectBudget / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Resources */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('overview.teamResources')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{t('overview.totalTeamMembers')}</div>
                  <div className="text-xs text-gray-500">
                    {t('overview.acrossAllProjects')}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {totalTeamMembers}
              </div>
            </div>

            <div className="space-y-2">
              {projects.map(project => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-900">{project.name}</span>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {project.teamMembers.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Comparison */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('overview.timelineComparison')}
        </h3>
        <div className="space-y-4">
          {projects.map(project => {
            const projectWeeks = project.phases.reduce((sum, phase) => {
              const weeks = parseInt(phase.duration.split(' ')[0]) || 0;
              return sum + weeks;
            }, 0);
            const percentage = totalWeeks > 0 ? (projectWeeks / totalWeeks) * 100 : 0;

            return (
              <div key={project.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{project.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {projectWeeks} {t('overview.weeks')} ({project.phases.length} {t('overview.phases')})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
