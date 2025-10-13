 import type { Project } from "./types/project";
 import type { User, UserRole } from "./types/user";
 import CommentSection from "../CommentSection";
 import FileUpload from "../FileUpload";
 import { ROLE_PERMISSIONS } from "../../types/user";
 import { AlertTriangle } from "lucide-react";
 
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
 }
 
 export default function RisksPanel({
   project, currentUser, userRole, comments, onAddComment, onReply
 }: Props) {
   const sectionKey = `${project.id}:risks`;
   const canUpload = ROLE_PERMISSIONS[userRole].canUpload;
   const canComment = ROLE_PERMISSIONS[userRole].canComment;
 
   return (
     <div className="space-y-4">
      <div className="flex items-center gap-2">
         <AlertTriangle className="w-5 h-5 text-blue-600" />
         <h3 className="text-lg font-semibold">Risk Management</h3>
       </div>

       {project.risks.map((risk, idx) => (
         <div key={idx} className="border border-gray-200 rounded-lg p-6">
           <div className="flex items-start justify-between mb-4">
             <div>
               <h4 className="font-semibold text-gray-900 mb-1">{risk.category} Risk</h4>
               <p className="text-gray-700">{risk.description}</p>
             </div>
             <div className="flex space-x-2 ml-4">
               <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge(risk.impact)}`}>
                 Impact: {risk.impact}
               </span>
               <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge(risk.probability)}`}>
                 Probability: {risk.probability}
               </span>
             </div>
           </div>
           <div className="bg-blue-50 p-3 rounded-md">
             <h5 className="text-sm font-medium text-gray-900 mb-1">Mitigation:</h5>
             <p className="text-sm text-gray-700">{risk.mitigation}</p>
           </div>
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
