import { useState, useEffect } from 'react';
import { Project, Phase, Risk, Budget, Communication } from '../types/project';
import { User } from '../types/user';
import { supabase } from '../lib/supabase';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects from Supabase
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);

      // 获取所有项目
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // 为每个项目加载相关数据
      const projectsWithData = await Promise.all(
        (projectsData || []).map(async (project) => {
          // 加载预算
          const { data: budgetData } = await supabase
            .from('project_budgets')
            .select('*')
            .eq('project_id', project.id)
            .maybeSingle();

          // 加载阶段
          const { data: phasesData } = await supabase
            .from('project_phases')
            .select('*')
            .eq('project_id', project.id)
            .order('order_index');

          // 为每个阶段加载附件和评审人
          const phases = await Promise.all(
            (phasesData || []).map(async (phase) => {
              const { data: attachments } = await supabase
                .from('phase_attachments')
                .select('*')
                .eq('phase_id', phase.id);

              const { data: reviewers } = await supabase
                .from('phase_reviewers')
                .select('*')
                .eq('phase_id', phase.id);

              return {
                name: phase.name,
                startDate: phase.start_date || undefined,
                endDate: phase.end_date || undefined,
                duration: phase.duration,
                content: phase.content,
                attachments: (attachments || []).map(a => ({
                  id: a.id,
                  name: a.name,
                  type: a.type,
                  size: a.size,
                  url: a.url,
                  uploadedAt: new Date(a.uploaded_at)
                })),
                reviewers: (reviewers || []).map(r => ({
                  id: r.id,
                  role: r.role,
                  status: r.status as 'pending' | 'approved' | 'rejected',
                  comment: r.comment,
                  reviewedAt: r.reviewed_at ? new Date(r.reviewed_at) : undefined
                }))
              };
            })
          );

          // 加载风险
          const { data: risksData } = await supabase
            .from('project_risks')
            .select('*')
            .eq('project_id', project.id)
            .order('order_index');

          // 加载团队成员
          const { data: teamData } = await supabase
            .from('project_team_members')
            .select('*')
            .eq('project_id', project.id)
            .order('order_index');

          // 加载会议
          const { data: meetingsData } = await supabase
            .from('project_meetings')
            .select('*')
            .eq('project_id', project.id)
            .order('order_index');

          // 加载利益相关者
          const { data: stakeholdersData } = await supabase
            .from('project_stakeholders')
            .select('*')
            .eq('project_id', project.id)
            .order('order_index');

          return {
            id: project.id,
            name: project.name,
            phases,
            risks: (risksData || []).map(r => ({
              category: r.category,
              description: r.description,
              impact: r.impact as 'High' | 'Medium' | 'Low',
              probability: r.probability as 'High' | 'Medium' | 'Low',
              mitigation: r.mitigation
            })),
            teamMembers: (teamData || []).map(t => ({
              role: t.role,
              responsibilities: t.responsibilities as string[],
              allocation: t.allocation
            })),
            communication: {
              meetings: (meetingsData || []).map(m => ({
                title: m.title,
                schedule: m.schedule,
                audience: m.audience,
                content: m.content
              })),
              stakeholders: (stakeholdersData || []).map(s => s.name)
            },
            budget: budgetData ? {
              personnelCosts: Number(budgetData.personnel_costs),
              technologyTools: Number(budgetData.technology_tools),
              marketingLaunch: Number(budgetData.marketing_launch),
              contingency: Number(budgetData.contingency)
            } : {
              personnelCosts: 0,
              technologyTools: 0,
              marketingLaunch: 0,
              contingency: 0
            }
          } as Project;
        })
      );

      setProjects(projectsWithData);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (name: string, createdBy: User): Promise<Project> => {
    const projectId = Math.random().toString(36).substr(2, 9);

    // 创建项目
    const { error: projectError } = await supabase
      .from('projects')
      .insert({
        id: projectId,
        name,
        created_by: createdBy.id
      });

    if (projectError) throw projectError;

    // 创建预算
    const { error: budgetError } = await supabase
      .from('project_budgets')
      .insert({
        id: Math.random().toString(36).substr(2, 9),
        project_id: projectId,
        personnel_costs: 0,
        technology_tools: 0,
        marketing_launch: 0,
        contingency: 0
      });

    if (budgetError) throw budgetError;

    // 创建默认阶段
    const defaultPhases = [
      { name: 'Planning Phase', duration: '2 weeks', content: 'Initial project planning and requirement gathering' },
      { name: 'Design Phase', duration: '3 weeks', content: 'System design and architecture planning' },
      { name: 'Development Phase', duration: '8 weeks', content: 'Core development and implementation' },
      { name: 'Testing Phase', duration: '2 weeks', content: 'Quality assurance and testing' },
      { name: 'Deployment Phase', duration: '1 week', content: 'Production deployment and launch' }
    ];

    for (let i = 0; i < defaultPhases.length; i++) {
      await supabase.from('project_phases').insert({
        id: Math.random().toString(36).substr(2, 9),
        project_id: projectId,
        name: defaultPhases[i].name,
        duration: defaultPhases[i].duration,
        content: defaultPhases[i].content,
        order_index: i
      });
    }

    // 创建默认团队成员
    const defaultTeam = [
      { role: 'Project Manager', responsibilities: ['Project coordination', 'Timeline management'], allocation: '100%' },
      { role: 'Developer', responsibilities: ['Code development', 'Technical implementation'], allocation: '100%' }
    ];

    for (let i = 0; i < defaultTeam.length; i++) {
      await supabase.from('project_team_members').insert({
        id: Math.random().toString(36).substr(2, 9),
        project_id: projectId,
        role: defaultTeam[i].role,
        responsibilities: defaultTeam[i].responsibilities,
        allocation: defaultTeam[i].allocation,
        order_index: i
      });
    }

    // 创建默认会议
    await supabase.from('project_meetings').insert({
      id: Math.random().toString(36).substr(2, 9),
      project_id: projectId,
      title: 'Project Kickoff',
      schedule: 'Week 1 - Monday 10:00 AM',
      audience: 'All Team Members',
      content: 'Project introduction, goals overview, and team introductions',
      order_index: 0
    });

    // 创建默认利益相关者
    const defaultStakeholders = ['Project Sponsor', 'Team Lead'];
    for (let i = 0; i < defaultStakeholders.length; i++) {
      await supabase.from('project_stakeholders').insert({
        id: Math.random().toString(36).substr(2, 9),
        project_id: projectId,
        name: defaultStakeholders[i],
        order_index: i
      });
    }

    // 重新加载所有项目
    await loadProjects();

    // 从数据库重新查询新创建的项目及其所有数据
    const { data: projectData, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    if (fetchError || !projectData) throw new Error('Failed to fetch created project');

    // 加载项目的所有相关数据
    const { data: budgetData } = await supabase
      .from('project_budgets')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle();

    const { data: phasesData } = await supabase
      .from('project_phases')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');

    const phases = await Promise.all(
      (phasesData || []).map(async (phase) => {
        const { data: attachments } = await supabase
          .from('phase_attachments')
          .select('*')
          .eq('phase_id', phase.id);

        const { data: reviewers } = await supabase
          .from('phase_reviewers')
          .select('*')
          .eq('phase_id', phase.id);

        return {
          name: phase.name,
          startDate: phase.start_date || undefined,
          endDate: phase.end_date || undefined,
          duration: phase.duration,
          content: phase.content,
          attachments: (attachments || []).map(a => ({
            id: a.id,
            name: a.name,
            type: a.type,
            size: a.size,
            url: a.url,
            uploadedAt: new Date(a.uploaded_at)
          })),
          reviewers: (reviewers || []).map(r => ({
            id: r.id,
            role: r.role,
            status: r.status as 'pending' | 'approved' | 'rejected',
            comment: r.comment,
            reviewedAt: r.reviewed_at ? new Date(r.reviewed_at) : undefined
          }))
        };
      })
    );

    const { data: risksData } = await supabase
      .from('project_risks')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');

    const { data: teamData } = await supabase
      .from('project_team_members')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');

    const { data: meetingsData } = await supabase
      .from('project_meetings')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');

    const { data: stakeholdersData } = await supabase
      .from('project_stakeholders')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');

    const newProject: Project = {
      id: projectData.id,
      name: projectData.name,
      phases: phases as Phase[],
      teamMembers: (teamData || []).map(t => ({
        role: t.role,
        responsibilities: t.responsibilities,
        allocation: t.allocation
      })),
      budget: budgetData ? {
        personnelCosts: budgetData.personnel_costs,
        technologyTools: budgetData.technology_tools,
        marketingLaunch: budgetData.marketing_launch,
        contingency: budgetData.contingency
      } : {
        personnelCosts: 0,
        technologyTools: 0,
        marketingLaunch: 0,
        contingency: 0
      },
      risks: (risksData || []).map(r => ({
        id: r.id,
        category: r.category,
        description: r.description,
        impact: r.impact as 'high' | 'medium' | 'low',
        probability: r.probability as 'high' | 'medium' | 'low',
        mitigation: r.mitigation
      })),
      communication: {
        stakeholders: (stakeholdersData || []).map(s => s.name),
        meetings: (meetingsData || []).map(m => ({
          id: m.id,
          title: m.title,
          schedule: m.schedule,
          audience: m.audience,
          content: m.content
        }))
      }
    };

    return newProject;
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    if (updates.name) {
      await supabase
        .from('projects')
        .update({ name: updates.name })
        .eq('id', projectId);
    }

    await loadProjects();
  };

  const updatePhase = async (projectId: string, phaseIndex: number, updates: Partial<Phase>) => {
    // 获取项目的所有阶段
    const { data: phases } = await supabase
      .from('project_phases')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');

    if (!phases || !phases[phaseIndex]) return;

    const phaseId = phases[phaseIndex].id;

    // 更新阶段
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.startDate !== undefined) updateData.start_date = updates.startDate;
    if (updates.endDate !== undefined) updateData.end_date = updates.endDate;
    if (updates.duration !== undefined) updateData.duration = updates.duration;
    if (updates.content !== undefined) updateData.content = updates.content;

    await supabase
      .from('project_phases')
      .update(updateData)
      .eq('id', phaseId);

    // 更新评审人
    if (updates.reviewers !== undefined) {
      // 删除现有评审人
      await supabase
        .from('phase_reviewers')
        .delete()
        .eq('phase_id', phaseId);

      // 添加新评审人
      for (const reviewer of updates.reviewers) {
        await supabase.from('phase_reviewers').insert({
          id: reviewer.id,
          phase_id: phaseId,
          role: reviewer.role,
          status: reviewer.status,
          comment: reviewer.comment,
          reviewed_at: reviewer.reviewedAt?.toISOString()
        });
      }
    }

    await loadProjects();
  };

  const addPhaseAttachment = async (projectId: string, phaseIndex: number, file: File) => {
    const { data: phases } = await supabase
      .from('project_phases')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');

    if (!phases || !phases[phaseIndex]) return;

    const phaseId = phases[phaseIndex].id;

    await supabase.from('phase_attachments').insert({
      id: Math.random().toString(36).substr(2, 9),
      phase_id: phaseId,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file)
    });

    await loadProjects();
  };

  const deleteProject = async (projectId: string) => {
    await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    await loadProjects();
  };

  const updateBudget = async (projectId: string, budget: Budget) => {
    const { data: existing } = await supabase
      .from('project_budgets')
      .select('id')
      .eq('project_id', projectId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('project_budgets')
        .update({
          personnel_costs: budget.personnelCosts,
          technology_tools: budget.technologyTools,
          marketing_launch: budget.marketingLaunch,
          contingency: budget.contingency
        })
        .eq('project_id', projectId);
    } else {
      await supabase
        .from('project_budgets')
        .insert({
          id: Math.random().toString(36).substr(2, 9),
          project_id: projectId,
          personnel_costs: budget.personnelCosts,
          technology_tools: budget.technologyTools,
          marketing_launch: budget.marketingLaunch,
          contingency: budget.contingency
        });
    }

    await loadProjects();
  };

  const addRisk = async (projectId: string, risk: Risk) => {
    const { data: risks } = await supabase
      .from('project_risks')
      .select('*')
      .eq('project_id', projectId);

    await supabase.from('project_risks').insert({
      id: Math.random().toString(36).substr(2, 9),
      project_id: projectId,
      category: risk.category,
      description: risk.description,
      impact: risk.impact,
      probability: risk.probability,
      mitigation: risk.mitigation,
      order_index: risks?.length || 0
    });

    await loadProjects();
  };

  const updateRisk = async (projectId: string, riskIndex: number, risk: Risk) => {
    const { data: risks } = await supabase
      .from('project_risks')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');

    if (!risks || !risks[riskIndex]) return;

    await supabase
      .from('project_risks')
      .update({
        category: risk.category,
        description: risk.description,
        impact: risk.impact,
        probability: risk.probability,
        mitigation: risk.mitigation
      })
      .eq('id', risks[riskIndex].id);

    await loadProjects();
  };

  const deleteRisk = async (projectId: string, riskIndex: number) => {
    const { data: risks } = await supabase
      .from('project_risks')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');

    if (!risks || !risks[riskIndex]) return;

    await supabase
      .from('project_risks')
      .delete()
      .eq('id', risks[riskIndex].id);

    await loadProjects();
  };

  const updateCommunication = async (projectId: string, communication: Communication) => {
    // 更新会议
    await supabase
      .from('project_meetings')
      .delete()
      .eq('project_id', projectId);

    for (let i = 0; i < communication.meetings.length; i++) {
      await supabase.from('project_meetings').insert({
        id: Math.random().toString(36).substr(2, 9),
        project_id: projectId,
        title: communication.meetings[i].title,
        schedule: communication.meetings[i].schedule,
        audience: communication.meetings[i].audience,
        content: communication.meetings[i].content,
        order_index: i
      });
    }

    // 更新利益相关者
    await supabase
      .from('project_stakeholders')
      .delete()
      .eq('project_id', projectId);

    for (let i = 0; i < communication.stakeholders.length; i++) {
      await supabase.from('project_stakeholders').insert({
        id: Math.random().toString(36).substr(2, 9),
        project_id: projectId,
        name: communication.stakeholders[i],
        order_index: i
      });
    }

    await loadProjects();
  };

  const addPhase = async (projectId: string) => {
    const { data: phases } = await supabase
      .from('project_phases')
      .select('*')
      .eq('project_id', projectId);

    await supabase.from('project_phases').insert({
      id: Math.random().toString(36).substr(2, 9),
      project_id: projectId,
      name: 'New Phase',
      duration: '1 week',
      content: 'Phase description',
      order_index: phases?.length || 0
    });

    await loadProjects();
  };

  const deletePhase = async (projectId: string, phaseIndex: number) => {
    const { data: phases } = await supabase
      .from('project_phases')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index');

    if (!phases || !phases[phaseIndex]) return;

    await supabase
      .from('project_phases')
      .delete()
      .eq('id', phases[phaseIndex].id);

    await loadProjects();
  };

  return {
    projects,
    loading,
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
  };
}
