 import { Clock, CheckCircle } from "lucide-react";
 import type { Project } from "./types/project";
 import type { User, UserRole } from "./types/user";
 import CommentSection from "../CommentSection";
 import FileUpload from "..//FileUpload";
 import { ROLE_PERMISSIONS } from "../../types/user";
 
 interface Props {
   project: Project;
   currentUser: User;
   userRole: UserRole;
   comments: Record<string, any[]>;
   onAddComment: (section: string) => (content: string, attachments?: File[]) => void;
   onReply: (section: string) => (commentId: string, content: string) => void;
 }
 
 export default function TimelinePanel({
   project, currentUser, userRole, comments, onAddComment, onReply
 }: Props) {
   const sectionKey = `${project.id}:timeline`;
   const canUpload = ROLE_PERMISSIONS[userRole].canUpload;
   const canComment = ROLE_PERMISSIONS[userRole].canComment;
 
   return (
     <div className="space-y-4">
       {project.phases.map((phase, i) => (
         <div key={i} className="border border-gray-200 rounded-lg p-4">
           <h3 className="font-semibold text-gray-900 mb-2">
             Phase {i + 1}: {phase.name}
           </h3>
           <p className="text-sm text-gray-600 mb-2">
             <Clock className="w-4 h-4 inline mr-1" />
             {phase.duration}
           </p>
           <div className="grid md:grid-cols-3 gap-4">
             <div>
               <h4 className="text-sm font-medium">Activities</h4>
               <ul className="text-sm text-gray-600 list-disc list-inside">
                 {phase.activities.map((a, idx) => <li key={idx}>{a}</li>)}
               </ul>
             </div>
             <div>
               <h4 className="text-sm font-medium">Deliverables</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                 {phase.deliverables.map((d, idx) => (
                   <li key={idx}><CheckCircle className="w-3 h-3 inline mr-1" />{d}</li>
                 ))}
               </ul>
             </div>
             <div>
               <h4 className="text-sm font-medium">Dependencies</h4>
               <ul className="text-sm text-gray-600 list-disc list-inside">
                 {phase.dependencies.map((dep, idx) => <li key={idx}>{dep}</li>)}
              </ul>
             </div>
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
