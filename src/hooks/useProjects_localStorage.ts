import { useState, useEffect } from 'react';
import { Project, Phase, Risk } from '../types/project';
import { User } from '../types/user';

const STORAGE_KEY = 'projects_data';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProjects(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load projects from localStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProjects = (updatedProjects: Project[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Failed to save projects to localStorage:', error);
    }
  };

  const createProject = async (name: string, createdBy: User): Promise<Project> => {
    const projectId = Math.random().toString(36).substr(2, 9);

    const newProject: Project = {
      id: projectId,
      name,
      phases: [
        { name: 'Planning Phase', duration: '2 weeks', content: 'Initial project planning and requirement gathering', attachments: [], reviewers: [] },
        { name: 'Design Phase', duration: '3 weeks', content: 'System design and architecture planning', attachments: [], reviewers: [] },
        { name: 'Development Phase', duration: '8 weeks', content: 'Core development and implementation', attachments: [], reviewers: [] },
        { name: 'Testing Phase', duration: '2 weeks', content: 'Quality assurance and testing', attachments: [], reviewers: [] },
        { name: 'Deployment Phase', duration: '1 week', content: 'Production deployment and launch', attachments: [], reviewers: [] }
      ],
      teamMembers: [
        { role: 'Project Manager', responsibilities: ['Project coordination', 'Timeline management'], allocation: '100%' },
        { role: 'Developer', responsibilities: ['Code development', 'Technical implementation'], allocation: '100%' }
      ],
      budget: {
        personnelCosts: 0,
        technologyTools: 0,
        marketingLaunch: 0,
        contingency: 0
      },
      risks: [],
      communication: {
        stakeholders: ['Project Sponsor', 'Team Lead'],
        meetings: [
          {
            id: Math.random().toString(36).substr(2, 9),
            title: 'Project Kickoff',
            schedule: 'Week 1 - Monday 10:00 AM',
            audience: 'All Team Members',
            content: 'Project introduction, goals overview, and team introductions'
          }
        ]
      }
    };

    const updatedProjects = [newProject, ...projects];
    saveProjects(updatedProjects);
    return newProject;
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, ...updates } : p
    );
    saveProjects(updatedProjects);
  };

  const deleteProject = async (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    saveProjects(updatedProjects);
  };

  const updatePhase = async (projectId: string, phaseIndex: number, updates: Partial<Phase>) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedPhases = [...p.phases];
        updatedPhases[phaseIndex] = { ...updatedPhases[phaseIndex], ...updates };
        return { ...p, phases: updatedPhases };
      }
      return p;
    });
    saveProjects(updatedProjects);
  };

  const addPhaseAttachment = async (projectId: string, phaseIndex: number, file: File) => {
    const attachment = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date()
    };

    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedPhases = [...p.phases];
        updatedPhases[phaseIndex] = {
          ...updatedPhases[phaseIndex],
          attachments: [...(updatedPhases[phaseIndex].attachments || []), attachment]
        };
        return { ...p, phases: updatedPhases };
      }
      return p;
    });
    saveProjects(updatedProjects);
  };

  const updateBudget = async (projectId: string, budget: Project['budget']) => {
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, budget } : p
    );
    saveProjects(updatedProjects);
  };

  const addRisk = async (projectId: string, risk: Omit<Risk, 'id'>) => {
    const newRisk: Risk = {
      ...risk,
      id: Math.random().toString(36).substr(2, 9)
    };

    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, risks: [...p.risks, newRisk] };
      }
      return p;
    });
    saveProjects(updatedProjects);
  };

  const updateRisk = async (projectId: string, riskId: string, updates: Partial<Risk>) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedRisks = p.risks.map(r =>
          r.id === riskId ? { ...r, ...updates } : r
        );
        return { ...p, risks: updatedRisks };
      }
      return p;
    });
    saveProjects(updatedProjects);
  };

  const deleteRisk = async (projectId: string, riskId: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, risks: p.risks.filter(r => r.id !== riskId) };
      }
      return p;
    });
    saveProjects(updatedProjects);
  };

  const updateCommunication = async (projectId: string, communication: Project['communication']) => {
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, communication } : p
    );
    saveProjects(updatedProjects);
  };

  const addPhase = async (projectId: string, phase: Phase) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, phases: [...p.phases, phase] };
      }
      return p;
    });
    saveProjects(updatedProjects);
  };

  const deletePhase = async (projectId: string, phaseIndex: number) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedPhases = p.phases.filter((_, index) => index !== phaseIndex);
        return { ...p, phases: updatedPhases };
      }
      return p;
    });
    saveProjects(updatedProjects);
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
