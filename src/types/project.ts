 // src/types/project.ts

 export interface Phase {
   name: string;
  startDate?: string;
  endDate?: string;
  duration: string; // Auto-calculated or manual
  content: string;
  attachments: PhaseAttachment[];
  reviewers: PhaseReviewer[];
 }

export interface PhaseAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface PhaseReviewer {
  id: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  comment: string;
  reviewedAt?: Date;
}

 export interface Risk {
   category: string;
   description: string;
   impact: 'High' | 'Medium' | 'Low';
   probability: 'High' | 'Medium' | 'Low';
   mitigation: string;
 }

export interface Budget {
  personnelCosts: number;
  technologyTools: number;
  marketingLaunch: number;
  contingency: number;
}
 export interface TeamMember {
   role: string;
   responsibilities: string[];
   allocation: string;
 }

 export interface Communication {
   meetings: {
     title: string;
     schedule: string;      // e.g. "Mondays 9:00–9:30"
     audience: string;      // e.g. "Core team"
     content: string;       // Meeting content/agenda
    content: string;       // Meeting content/agenda
   }[];
   stakeholders: string[];  // simple list for now
 }

 export interface Project {
   id: string;
   name: string;
   phases: Phase[];
   risks: Risk[];
   teamMembers: TeamMember[];
   communication: Communication;
   budget: Budget;
  budget: Budget;
 }

