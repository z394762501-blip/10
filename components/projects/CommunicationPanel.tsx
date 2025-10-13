 import type { Project } from "./types/project";
 import type { User, UserRole } from "./types/user";
 import CommentSection from "../CommentSection";
 import FileUpload from "../FileUpload";
 import { ROLE_PERMISSIONS } from "../../types/user";
 import { Calendar, MessageSquare } from "lucide-react";
 
 interface Props {
   project: Project;
   currentUser: User;
   userRole: UserRole;
   comments: Record<string, any[]>;
   onAddComment: (section: string) => (content: string, attachments?: File[]) => void;
   onReply: (section: string) => (commentId: string, content: string) => void;
 }
 
 export default function CommunicationPanel({
   project, currentUser, userRole, comments, onAddComment, onReply
 }: Props) {
   const sectionKey = `${project.id}:communication`;
   const canUpload = ROLE_PERMISSIONS[userRole].canUpload;
   const canComment = ROLE_PERMISSIONS[userRole].canComment;
 
   return (
     <div className="space-y-6">
       <div>
         <div className="flex items-center gap-2 mb-2">
           <MessageSquare className="w-5 h-5 text-blue-600" />
           <h3 className="text-lg font-semibold">Stakeholders</h3>
         </div>
         <div className="flex flex-wrap gap-2">
           {project.communication.stakeholders.map((s, i) => (
             <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">{s}</span>
           ))}
         </div>
       </div>
 
       <div>
         <div className="flex items-center gap-2 mb-2">
           <Calendar className="w-5 h-5 text-blue-600" />
           <h3 className="text-lg font-semibold">Meetings</h3>
         </div>
         <div className="grid md:grid-cols-2 gap-4">
           {project.communication.meetings.map((m, i) => (
            <div key={i} className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                   <h4 className="font-medium text-gray-900">{m.title}</h4>
                   <p className="text-sm text-gray-600">{m.schedule}</p>
                </div>
                 <div className="text-right">
                   <span className="text-sm font-medium text-blue-700">{m.audience}</span>
                 </div>
               </div>
            </div>
           ))}
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
