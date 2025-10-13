import type { Project } from './types/project';
import TimelinePanel from './components/projects/TimelinePanel';
import ResourcesPanel from './components/projects/ResourcesPanel';
import RisksPanel from './components/projects/RisksPanel';
import CommunicationPanel from './components/projects/CommunicationPanel';

import { useState } from 'react';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import CommentSection from './components/CommentSection';
import FileUpload from './components/FileUpload';
import { useAuth } from './hooks/useAuth';
import { useComments } from './hooks/useComments';
import { ROLE_PERMISSIONS } from './types/user';

import './App.css';
import { 
  Calendar, 
   Users, 
   Target, 
   AlertTriangle, 
   MessageSquare, 
   CheckCircle, 
   Clock, 
   DollarSign, 
   Briefcase, 
   TrendingUp,
   Shield,
   Bell
 } from 'lucide-react';


 interface Phase {
  name: string;
  duration: string;
  activities: string[];
  deliverables: string[];
  dependencies: string[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD

  
}
interface Risk {
  category: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  probability: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

interface TeamMember {
  role: string;
  responsibilities: string[];
  allocation: string;
}



function App() {
  const [activeSection, setActiveSection] = useState('scope');
  const { user, isLoading: authLoading, login, logout, isAuthenticated } = useAuth();
  const { comments, addComment, addReply } = useComments();
  const [loginError, setLoginError] = useState<string>('');
  const handleSelectProject = () => {};
  const handleCreateProject = () => {};
  const handleDeleteProject = () => {};
  const handleLogin = async (email: string, password: string, role: any) => {
    setLoginError('');
    const result = await login(email, password, role);
    if (!result.success) {
      setLoginError(result.error || 'Login failed');
    }
  };

  const handleAddComment = (section: string) => (content: string, attachments?: File[]) => {
    if (user) {
      addComment(section, content, user, attachments);
    }
  };

  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const projects: Project[] = [
       {
         id: 'projectA',
         name: 'Project A - Mobile App',
         phases: [
           { name: 'Research & Discovery', duration: 'Months 1–3', activities: ['Market research','User interviews','Feasibility'], deliverables: ['Research report','Personas','Tech reqs'], dependencies: ['Stakeholder approval'] },
           { name: 'Development', duration: 'Months 4–9', activities: ['Core features','API integration','Testing'], deliverables: ['MVP','Beta','Docs'], dependencies: ['Design sign-off'] },
         ],
         risks: [
           { category: 'Technical', description: 'Legacy integration risk', impact: 'High', probability: 'Medium', mitigation: 'Early POCs, integration spikes' },
         ],
         teamMembers: [
           { role: 'Product Manager', responsibilities: ['Strategy','Roadmap','Stakeholders'], allocation: '100%' },
           { role: 'Developers', responsibilities: ['Coding','Testing'], allocation: '3 FTE' },
         ],
         communication: {
           stakeholders: ['Executive Team','Core Team','External Partners'],
           meetings: [
             { title: 'Weekly Standup', schedule: 'Mon 09:00–09:30', audience: 'Core team' },
             { title: 'Sprint Review', schedule: 'Bi-weekly Fri 14:00–15:30', audience: 'Dev team' },
           ],
         },
       },
       {
         id: 'projectB',
         name: 'Project B - Web Platform',
         phases: [
           { name: 'Planning', duration: 'Months 1–2', activities: ['Wireframes','Prototypes','Architecture'], deliverables: ['Design specs','Project plan'], dependencies: ['Budget approval'] },
           { name: 'Launch', duration: 'Months 10–11', activities: ['Marketing','Training','Deployment'], deliverables: ['Launch event','Support docs'], dependencies: ['QA completion'] },
         ],
         risks: [
           { category: 'Market', description: 'Competitive pressure', impact: 'Medium', probability: 'High', mitigation: 'Continuous monitoring, fast iteration' },
         ],
         teamMembers: [
           { role: 'Tech Lead', responsibilities: ['Architecture','Code quality'], allocation: '100%' },
           { role: 'QA Engineer', responsibilities: ['Test planning','Bug tracking'], allocation: '100%' },
         ],
         communication: {
           stakeholders: ['Leadership','Project Team'],
           meetings: [
             { title: 'Exec Steering', schedule: 'Monthly Wed 10:00–11:00', audience: 'Leadership' },
           ],
         },
       },
     ];


  const handleReply = (section: string) => (commentId: string, content: string) => {
    if (user) {
      addReply(section, commentId, content, user);
    }
  };

  const handleFileUpload = (files: File[], section: string) => {
    // In a real app, this would upload to a server
    console.log('Uploading files:', files, 'to section:', section);
    return Promise.resolve();
  };

  const canEditSection = (section: string) => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role];
    return permissions.canEdit.includes(section);
  };

  const canViewAllSections = () => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].canViewAll;
  };
        
  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginForm 
        onLogin={handleLogin}
        isLoading={authLoading}
        error={loginError}
      />
    );
  }

  if (!user) return null;

  const phases: Phase[] = [
    {
      name: "Research & Discovery",
      duration: "3 months (Months 1-3)",
      activities: [
        "Market research and competitive analysis",
        "User interviews and surveys",
        "Technical feasibility assessment",
        "Business case development"
      ],
      deliverables: [
        "Market research report",
        "User persona documentation",
        "Technical requirements specification",
        "Business case and ROI analysis"
      ],
      dependencies: ["Stakeholder approval", "Research budget allocation"],
      startDate: "2025-01-01",
      endDate: "2025-03-31"
    },
    {
      name: "Design & Planning",
      duration: "2 months (Months 4-5)",
      activities: [
        "Product design and prototyping",
        "User experience design",
        "Technical architecture planning",
        "Project roadmap finalization"
      ],
      deliverables: [
        "Product design specifications",
        "Interactive prototypes",
        "Technical architecture document",
        "Detailed project timeline"
      ],
      dependencies: ["Research completion", "Design team onboarding"],
      startDate: "2025-04-01",
      endDate: "2025-05-31"
    },
    {
      name: "Development",
      duration: "6 months (Months 6-11)",
      activities: [
        "Core product development",
        "Feature implementation",
        "Integration testing",
        "Performance optimization"
      ],
      deliverables: [
        "MVP (Month 8)",
        "Beta version (Month 10)",
        "Production-ready product",
        "Documentation and guides"
      ],
      dependencies: ["Design approval", "Development team scaling"],
      startDate: "2025-06-01",
      endDate: "2025-11-30"
    },
    {
      name: "Testing & Quality Assurance",
      duration: "2 months (Months 10-12)",
      activities: [
        "User acceptance testing",
        "Performance and security testing",
        "Bug fixes and improvements",
        "Compliance verification"
      ],
      deliverables: [
        "Test results documentation",
        "Quality assurance report",
        "Final product version",
        "Compliance certificates"
      ],
      dependencies: ["Development completion", "Testing environment setup"],
      startDate: "2025-10-01",
      endDate: "2025-12-31"
    },
    {
      name: "Launch & Market Release",
      duration: "3 months (Months 13-15)",
      activities: [
        "Marketing campaign execution",
        "Sales team training",
        "Product launch event",
        "Customer support setup"
      ],
      deliverables: [
        "Marketing materials",
        "Sales enablement resources",
        "Launch event execution",
        "Support documentation"
      ],
      dependencies: ["Testing completion", "Marketing team readiness"],
      startDate: "2026-01-01",
      endDate: "2026-03-31"
    }
  ];

  const risks: Risk[] = [
    {
      category: "Technical",
      description: "Integration challenges with existing systems",
      impact: "High",
      probability: "Medium",
      mitigation: "Early technical validation, proof of concepts, dedicated integration team"
    },
    {
      category: "Market",
      description: "Competitive landscape changes",
      impact: "Medium",
      probability: "High",
      mitigation: "Continuous market monitoring, flexible product features, rapid iteration capability"
    },
    {
      category: "Resource",
      description: "Key team member unavailability",
      impact: "High",
      probability: "Low",
      mitigation: "Cross-training, documentation, backup resource identification"
    },
    {
      category: "Timeline",
      description: "Scope creep and feature additions",
      impact: "Medium",
      probability: "High",
      mitigation: "Clear scope definition, change control process, regular stakeholder alignment"
    },
    {
      category: "Budget",
      description: "Cost overruns in development phase",
      impact: "High",
      probability: "Medium",
      mitigation: "Detailed budget tracking, regular reviews, contingency fund allocation"
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      role: "Product Manager",
      responsibilities: ["Overall product strategy", "Stakeholder management", "Roadmap planning"],
      allocation: "100%"
    },
    {
      role: "Technical Lead",
      responsibilities: ["Technical architecture", "Team leadership", "Code quality assurance"],
      allocation: "100%"
    },
    {
      role: "UX/UI Designer",
      responsibilities: ["User experience design", "Interface design", "Usability testing"],
      allocation: "80%"
    },
    {
      role: "Software Engineers",
      responsibilities: ["Feature development", "Code implementation", "Testing"],
      allocation: "3 FTE (100% each)"
    },
    {
      role: "QA Engineer",
      responsibilities: ["Test planning", "Quality assurance", "Bug tracking"],
      allocation: "100%"
    },
    {
      role: "Marketing Manager",
      responsibilities: ["Go-to-market strategy", "Marketing campaigns", "Launch coordination"],
      allocation: "60%"
    },
    {
      role: "Project Coordinator",
      responsibilities: ["Project tracking", "Meeting coordination", "Documentation"],
      allocation: "50%"
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sections = [
    { id: 'scope', name: 'Project Scope', icon: Target },
    {
      id: 'projects',
      name: 'Projects (New)',
      icon: Briefcase,
      children: [
        { id: 'timeline', name: 'Timeline & Phases', icon: Calendar },
        { id: 'resources', name: 'Resource Planning', icon: Users },
        { id: 'risks', name: 'Risk Management', icon: AlertTriangle },
        { id: 'communication', name: 'Communication Plan', icon: MessageSquare },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Development Project Plan</h1>
              <p className="mt-2 text-gray-600">Comprehensive project management framework for successful product launch</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-gray-900">Timeline: 15 Months</div>
                <div className="text-sm text-gray-500">Team Size: 8-12 Members</div>
              </div>
              <UserProfile user={user} onLogout={logout} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections</h3>
              <ul className="space-y-2">
  {sections.map((section) => {
    // 如果有 children，渲染子菜单
    if (section.children) {
      return (
        <li key={section.id}>
          <div className="font-semibold flex items-center">
            <section.icon className="w-5 h-5 mr-2" />
            {section.name}
          </div>
          <ul className="ml-6 mt-2 space-y-1">
            {section.children.map((child) => {
              const ChildIcon = child.icon;
              return (
                <li key={child.id}>
                  <button
                    onClick={() => setActiveSection(child.id)}
                    className={`w-full flex items-center px-2 py-1 text-left rounded-md ${
                      activeSection === child.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ChildIcon className="w-4 h-4 mr-2" />
                    {child.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </li>
      );
    }

    // 普通一级菜单
    const Icon = section.icon;
    return (
      <li key={section.id}>
        <button
          onClick={() => setActiveSection(section.id)}
          className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
            activeSection === section.id
              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Icon className="w-5 h-5 mr-2" />
          {section.name}
        </button>
      </li>
    );
  })}
</ul>

            </nav>
          </div>

          {/* Main Content */}
          {activeSection === 'projects' && (
            <ProjectList
            projects={projects}
            currentUser={user}
            onSelectProject={handleSelectProject}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
          />
          )}
          <div className="flex-1">
            {activeSection === 'scope' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center mb-6">
                  <Target className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Project Scope & Objectives</h2>
                </div>


                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                      Product Vision
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">
                        Develop an innovative consumer product that addresses key market needs and delivers 
                        exceptional user experience while maintaining competitive positioning and achieving 
                        sustainable profitability.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 text-purple-600 mr-2" />
                      Target Market
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-gray-700">Primary: Ages 25-45, middle to upper-middle income</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-gray-700">Geographic: North American markets initially</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-gray-700">Behavioral: Tech-savvy early adopters and mainstream users</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 text-red-600 mr-2" />
                    Key Success Metrics
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-700">$2.5M</div>
                      <div className="text-sm text-gray-600">Revenue Target (Year 1)</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-700">10,000</div>
                      <div className="text-sm text-gray-600">Units Sold (Year 1)</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-700">25%</div>
                      <div className="text-sm text-gray-600">Market Share Target</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 text-gray-600 mr-2" />
                    Project Boundaries & Deliverables
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">In Scope</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Core product development and testing
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Marketing strategy and launch campaign
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Initial customer support setup
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Compliance and regulatory approval
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Out of Scope</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• International market expansion</li>
                        <li>• Advanced analytics dashboard</li>
                        <li>• Enterprise-level integrations</li>
                        <li>• White-label solutions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                {ROLE_PERMISSIONS[user.role].canUpload && (
                  <FileUpload
                    section="scope"
                    currentUser={user}
                    onUpload={handleFileUpload}
                  />
                )}

                {/* Comments Section */}
                {ROLE_PERMISSIONS[user.role].canComment && (
                  <CommentSection
                    section="scope"
                    comments={comments.scope || []}
                    currentUser={user}
                    onAddComment={handleAddComment('scope')}
                    onReply={handleReply('scope')}
                  />
                )}
              </div>
            )}

            {activeSection === 'timeline' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center mb-6">
                  <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Timeline & Phases</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Total Project Duration</h3>
                        <p className="text-gray-600">15 months with 2-month buffer period included</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-700">15 Months</div>
                        <div className="text-sm text-gray-600">Jan 2025 - Mar 2026</div>
                      </div>
                    </div>
                  </div>
                </div>           
   <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
     <h2 className="text-xl font-bold mb-4">Projects</h2>
     {projects.map((project) => (
       <div key={project.id} className="border rounded-lg">
         <button
           onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
           className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200"
         >
           <span className="font-semibold">{project.name}</span>
           <span className="text-sm text-gray-500">
             {expandedProject === project.id ? '▲ Collapse' : '▼ Expand'}
           </span>
         </button>
 
         {expandedProject === project.id && (
           <div className="p-4 space-y-8">
             <section>
               <h3 className="text-lg font-semibold mb-3">Timeline & Phases</h3>
               <TimelinePanel
                 project={project}
                 currentUser={user}
                 userRole={user.role}
                 comments={comments}
                 onAddComment={handleAddComment}
                 onReply={handleReply}
               />
             </section>
 
             <section>
               <h3 className="text-lg font-semibold mb-3">Resource Planning</h3>
               <ResourcesPanel
                 project={project}
                 currentUser={user}
                 userRole={user.role}
                 comments={comments}
                 onAddComment={handleAddComment}
                 onReply={handleReply}
               />
             </section>
 
             <section>
               <h3 className="text-lg font-semibold mb-3">Risk Management</h3>
               <RisksPanel
                 project={project}
                 currentUser={user}
                 userRole={user.role}
                 comments={comments}
                 onAddComment={handleAddComment}
                 onReply={handleReply}
               />
             </section>
 
             <section>
               <h3 className="text-lg font-semibold mb-3">Communication Plan</h3>
               <CommunicationPanel
                 project={project}
                 currentUser={user}
                 userRole={user.role}
                 comments={comments}
                 onAddComment={handleAddComment}
                 onReply={handleReply}
               />
             </section>
           </div>
         )}
       </div>
     ))}
   </div>
 )}




                <div className="space-y-6">
                  {phases.map((phase, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            Phase {index + 1}: {phase.name}
                          </h3>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {phase.duration}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            index === 0 ? 'bg-green-100 text-green-800' :
                            index === 1 ? 'bg-blue-100 text-blue-800' :
                            index === 2 ? 'bg-purple-100 text-purple-800' :
                            index === 3 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Phase {index + 1}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Activities</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {phase.activities.map((activity, actIndex) => (
                              <li key={actIndex} className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Deliverables</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {phase.deliverables.map((deliverable, delIndex) => (
                              <li key={delIndex} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                {deliverable}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Dependencies</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {phase.dependencies.map((dependency, depIndex) => (
                              <li key={depIndex} className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                {dependency}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* File Upload Section */}
                {ROLE_PERMISSIONS[user.role].canUpload && (
                  <FileUpload
                    section="timeline"
                    currentUser={user}
                    onUpload={handleFileUpload}
                  />
                )}

                {/* Comments Section */}
                {ROLE_PERMISSIONS[user.role].canComment && (
                  <CommentSection
                    section="timeline"
                    comments={comments.timeline || []}
                    currentUser={user}
                    onAddComment={handleAddComment('timeline')}
                    onReply={handleReply('timeline')}
                  />
                )}
              </div>
            )}

            {activeSection === 'resources' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center mb-6">
                  <Users className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Resource Planning</h2>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    Budget Overview
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-700">$850K</div>
                      <div className="text-sm text-gray-600">Personnel Costs</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-700">$200K</div>
                      <div className="text-sm text-gray-600">Technology & Tools</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-700">$300K</div>
                      <div className="text-sm text-gray-600">Marketing & Launch</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-700">$150K</div>
                      <div className="text-sm text-gray-600">Contingency (10%)</div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 text-purple-600 mr-2" />
                    Team Structure & Roles
                  </h3>
                  <div className="grid gap-4">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{member.role}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {member.allocation}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {member.responsibilities.map((responsibility, respIndex) => (
                            <span
                              key={respIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                            >
                              {responsibility}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 text-amber-600 mr-2" />
                    External Resources & Vendors
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Specialized Services</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Legal and compliance consulting</li>
                        <li>• Industrial design partnership</li>
                        <li>• Manufacturing and logistics</li>
                        <li>• Market research agency</li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Technology Stack</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Development tools and licenses</li>
                        <li>• Cloud infrastructure services</li>
                        <li>• Analytics and monitoring tools</li>
                        <li>• Project management software</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                {ROLE_PERMISSIONS[user.role].canUpload && (
                  <FileUpload
                    section="resources"
                    currentUser={user}
                    onUpload={handleFileUpload}
                  />
                )}

                {/* Comments Section */}
                {ROLE_PERMISSIONS[user.role].canComment && (
                  <CommentSection
                    section="resources"
                    comments={comments.resources || []}
                    currentUser={user}
                    onAddComment={handleAddComment('resources')}
                    onReply={handleReply('resources')}
                  />
                )}
              </div>
            )}

            {activeSection === 'risks' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Risk Management</h2>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    Risk Assessment Matrix
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>Risk Level Distribution</span>
                      <span>5 identified risks</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="h-2 bg-red-500 rounded-l" style={{ width: '40%' }}></div>
                      <div className="h-2 bg-amber-500" style={{ width: '40%' }}></div>
                      <div className="h-2 bg-green-500 rounded-r" style={{ width: '20%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>High (2)</span>
                      <span>Medium (2)</span>
                      <span>Low (1)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {risks.map((risk, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{risk.category} Risk</h4>
                          <p className="text-gray-700">{risk.description}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.impact)}`}>
                            Impact: {risk.impact}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.probability)}`}>
                            Probability: {risk.probability}
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-md">
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Mitigation Strategy:</h5>
                        <p className="text-sm text-gray-700">{risk.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    Contingency Plans
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <h4 className="font-medium text-red-900 mb-2">Critical Risk Response</h4>
                      <ul className="space-y-1 text-sm text-red-800">
                        <li>• Immediate escalation to senior management</li>
                        <li>• Emergency resource reallocation protocols</li>
                        <li>• Alternative vendor/partner activation</li>
                        <li>• Scope reduction decision framework</li>
                      </ul>
                    </div>
                    <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                      <h4 className="font-medium text-amber-900 mb-2">Budget Overrun Response</h4>
                      <ul className="space-y-1 text-sm text-amber-800">
                        <li>• 15% contingency fund activation</li>
                        <li>• Feature prioritization review</li>
                        <li>• Phase extension vs. scope reduction analysis</li>
                        <li>• Additional funding request preparation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                {ROLE_PERMISSIONS[user.role].canUpload && (
                  <FileUpload
                    section="risks"
                    currentUser={user}
                    onUpload={handleFileUpload}
                  />
                )}

                {/* Comments Section */}
                {ROLE_PERMISSIONS[user.role].canComment && (
                  <CommentSection
                    section="risks"
                    comments={comments.risks || []}
                    currentUser={user}
                    onAddComment={handleAddComment('risks')}
                    onReply={handleReply('risks')}
                  />
                )}
              </div>
            )}

            {activeSection === 'communication' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center mb-6">
                  <MessageSquare className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Communication Plan</h2>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 text-purple-600 mr-2" />
                    Stakeholder Matrix
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 text-center">Executive Team</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium">Monthly</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <span className="font-medium">Dashboard + Presentation</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Focus:</span>
                          <span className="font-medium">Strategic updates</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 text-center">Project Team</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium">Weekly</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <span className="font-medium">Stand-up + Sprint review</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Focus:</span>
                          <span className="font-medium">Progress & blockers</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 text-center">External Partners</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium">Bi-weekly</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <span className="font-medium">Video calls + Reports</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Focus:</span>
                          <span className="font-medium">Deliverables & timelines</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    Meeting Schedule
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Weekly Team Standup</h4>
                          <p className="text-sm text-gray-600">Every Monday, 9:00 AM - 9:30 AM</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-blue-700">Core Team</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Sprint Planning & Review</h4>
                          <p className="text-sm text-gray-600">Bi-weekly, Friday, 2:00 PM - 3:30 PM</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-green-700">Development Team</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Executive Steering Committee</h4>
                          <p className="text-sm text-gray-600">Monthly, Last Wednesday, 10:00 AM - 11:00 AM</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-purple-700">Leadership</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Bell className="w-5 h-5 text-amber-600 mr-2" />
                    Progress Tracking & Reporting
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Key Performance Indicators</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Sprint velocity and burn-down rates
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Budget utilization vs. plan
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          Quality metrics and defect rates
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                          Stakeholder satisfaction scores
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Reporting Tools & Channels</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Project management dashboard (real-time)</li>
                        <li>• Weekly status reports via email</li>
                        <li>• Monthly executive presentations</li>
                        <li>• Quarterly business reviews</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
                    Immediate Next Steps
                  </h3>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-green-900 mb-3">Week 1 Actions</h4>
                        <ul className="space-y-2 text-sm text-green-800">
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Finalize team assignments and onboarding
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Set up project management tools and dashboards
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Conduct project kickoff meeting
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Begin market research activities
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-green-900 mb-3">Month 1 Milestones</h4>
                        <ul className="space-y-2 text-sm text-green-800">
                          <li>• Complete stakeholder analysis and engagement plan</li>
                          <li>• Establish all communication channels and schedules</li>
                          <li>• Finalize project charter and get executive approval</li>
                          <li>• Complete initial risk assessment and mitigation plans</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                {ROLE_PERMISSIONS[user.role].canUpload && (
                  <FileUpload
                    section="communication"
                    currentUser={user}
                    onUpload={handleFileUpload}
                  />
                )}

                {/* Comments Section */}
                {ROLE_PERMISSIONS[user.role].canComment && (
                  <CommentSection
                    section="communication"
                    comments={comments.communication || []}
                    currentUser={user}
                    onAddComment={handleAddComment('communication')}
                    onReply={handleReply('communication')}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


;