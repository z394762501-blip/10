 // src/types/project.ts

 export interface Phase {
   name: string;
   duration: string;
   activities: string[];
   deliverables: string[];
   dependencies: string[];
 }

 export interface Risk {
   category: string;
   description: string;
   impact: 'High' | 'Medium' | 'Low';
   probability: 'High' | 'Medium' | 'Low';
   mitigation: string;
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
 }

