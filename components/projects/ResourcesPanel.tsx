 import type { Project } from "./types/project";
 import type { User, UserRole } from "./types/user";
 import CommentSection from "../CommentSection";
 import FileUpload from "..//FileUpload";
 import { ROLE_PERMISSIONS } from "../../types/user";
 import { Users, DollarSign, Briefcase, CheckCircle } from "lucide-react";
 
 interface Props {
   project: Project;
   currentUser: User;
   userRole: UserRole;
   comments: Record<string, any[]>;
   onAddComment: (section: string) => (content: string, attachments?: File[]) => void;
   onReply: (section: string) => (commentId: string, content: string) => void;
 }
 
 export default function ResourcesPanel({
   project, currentUser, userRole, comments, onAddComment, onReply
 }: Props) {
   const sectionKey = `${project.id}:resources`;
   const canUpload = ROLE_PERMISSIONS[userRole].canUpload;
   const canComment = ROLE_PERMISSIONS[userRole].canComment;
 
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
 
       {/* (Optional) budget summary placeholder to mirror your old UI */}
       <div className="grid md:grid-cols-4 gap-4">
         <div className="bg-blue-50 p-4 rounded-lg text-center">
           <div className="text-2xl font-bold text-blue-700">$—</div>
           <div className="text-sm text-gray-600">Personnel Costs</div>
         </div>
         <div className="bg-green-50 p-4 rounded-lg text-center">
           <div className="text-2xl font-bold text-green-700">$—</div>
           <div className="text-sm text-gray-600">Technology & Tools</div>
         </div>
         <div className="bg-purple-50 p-4 rounded-lg text-center">
           <div className="text-2xl font-bold text-purple-700">$—</div>
           <div className="text-sm text-gray-600">Marketing & Launch</div>
         </div>
         <div className="bg-gray-50 p-4 rounded-lg text-center">
           <div className="text-2xl font-bold text-gray-700">$—</div>
           <div className="text-sm text-gray-600">Contingency</div>
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
