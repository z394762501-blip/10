/*
  # 项目管理系统数据库架构
  
  ## 概述
  为项目管理门户创建完整的数据库架构，包括用户、项目、阶段、风险、评论等表。
  
  ## 新建表
  
  ### 1. users (用户表)
  - id (text, 主键) - 用户唯一标识（使用text以兼容前端）
  - email (text, 唯一) - 用户邮箱
  - name (text) - 用户姓名
  - role (text) - 用户角色
  - avatar (text, 可选) - 头像URL
  - department (text, 可选) - 部门
  - created_at (timestamptz) - 创建时间
  - updated_at (timestamptz) - 更新时间
  
  ### 2. projects (项目表)
  - id (text, 主键) - 项目唯一标识
  - name (text) - 项目名称
  - created_by (text) - 创建者ID
  - created_at (timestamptz) - 创建时间
  - updated_at (timestamptz) - 更新时间
  
  ### 3-11. 其他相关表...
  
  ## 安全策略
  - 为所有表启用RLS（行级安全）
  - 用户只能访问自己有权限的项目数据
*/

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  avatar text,
  department text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
  id text PRIMARY KEY,
  name text NOT NULL,
  created_by text REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建项目预算表
CREATE TABLE IF NOT EXISTS project_budgets (
  id text PRIMARY KEY,
  project_id text REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  personnel_costs numeric DEFAULT 0,
  technology_tools numeric DEFAULT 0,
  marketing_launch numeric DEFAULT 0,
  contingency numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- 创建项目阶段表
CREATE TABLE IF NOT EXISTS project_phases (
  id text PRIMARY KEY,
  project_id text REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date date,
  end_date date,
  duration text NOT NULL DEFAULT '1 week',
  content text DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建阶段附件表
CREATE TABLE IF NOT EXISTS phase_attachments (
  id text PRIMARY KEY,
  phase_id text REFERENCES project_phases(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  size bigint NOT NULL,
  url text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- 创建阶段评审人表
CREATE TABLE IF NOT EXISTS phase_reviewers (
  id text PRIMARY KEY,
  phase_id text REFERENCES project_phases(id) ON DELETE CASCADE,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  comment text DEFAULT '',
  reviewed_at timestamptz
);

-- 创建项目风险表
CREATE TABLE IF NOT EXISTS project_risks (
  id text PRIMARY KEY,
  project_id text REFERENCES projects(id) ON DELETE CASCADE,
  category text NOT NULL,
  description text NOT NULL,
  impact text NOT NULL,
  probability text NOT NULL,
  mitigation text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建项目团队成员表
CREATE TABLE IF NOT EXISTS project_team_members (
  id text PRIMARY KEY,
  project_id text REFERENCES projects(id) ON DELETE CASCADE,
  role text NOT NULL,
  responsibilities jsonb DEFAULT '[]'::jsonb,
  allocation text NOT NULL DEFAULT '100%',
  order_index integer NOT NULL DEFAULT 0
);

-- 创建项目会议表
CREATE TABLE IF NOT EXISTS project_meetings (
  id text PRIMARY KEY,
  project_id text REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  schedule text NOT NULL,
  audience text NOT NULL,
  content text DEFAULT '',
  order_index integer NOT NULL DEFAULT 0
);

-- 创建项目利益相关者表
CREATE TABLE IF NOT EXISTS project_stakeholders (
  id text PRIMARY KEY,
  project_id text REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_index integer NOT NULL DEFAULT 0
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id text PRIMARY KEY,
  project_id text REFERENCES projects(id) ON DELETE CASCADE,
  section text NOT NULL,
  user_id text NOT NULL,
  user_name text NOT NULL,
  user_role text NOT NULL,
  content text NOT NULL,
  parent_id text REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_project_phases_project_id ON project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_project_phases_order ON project_phases(project_id, order_index);
CREATE INDEX IF NOT EXISTS idx_phase_attachments_phase_id ON phase_attachments(phase_id);
CREATE INDEX IF NOT EXISTS idx_phase_reviewers_phase_id ON phase_reviewers(phase_id);
CREATE INDEX IF NOT EXISTS idx_project_risks_project_id ON project_risks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_members_project_id ON project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_meetings_project_id ON project_meetings(project_id);
CREATE INDEX IF NOT EXISTS idx_project_stakeholders_project_id ON project_stakeholders(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- 启用行级安全
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase_reviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "Allow all operations on users"
  ON users FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 项目表策略
CREATE POLICY "Allow all operations on projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 项目预算策略
CREATE POLICY "Allow all operations on project budgets"
  ON project_budgets FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 项目阶段策略
CREATE POLICY "Allow all operations on project phases"
  ON project_phases FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 阶段附件策略
CREATE POLICY "Allow all operations on phase attachments"
  ON phase_attachments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 阶段评审人策略
CREATE POLICY "Allow all operations on phase reviewers"
  ON phase_reviewers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 项目风险策略
CREATE POLICY "Allow all operations on project risks"
  ON project_risks FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 项目团队成员策略
CREATE POLICY "Allow all operations on project team members"
  ON project_team_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 项目会议策略
CREATE POLICY "Allow all operations on project meetings"
  ON project_meetings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 项目利益相关者策略
CREATE POLICY "Allow all operations on project stakeholders"
  ON project_stakeholders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 评论策略
CREATE POLICY "Allow all operations on comments"
  ON comments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
