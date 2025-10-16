# 本地存储指南

本应用现在使用浏览器的 localStorage 来存储所有数据，无需连接 Supabase 数据库。

## 存储的数据

### 1. 项目数据 (projects_data)
存储键：`projects_data`

包含所有项目信息：
- 项目基本信息（ID、名称）
- 项目阶段（Planning, Design, Development, Testing, Deployment）
- 团队成员
- 预算信息
- 风险管理
- 沟通计划（会议、利益相关者）

### 2. 评论数据 (comments_data)
存储键：`comments_data`

包含所有评论和回复：
- 按项目和节点分组的评论
- 用户信息（ID、姓名、角色）
- 评论内容和时间戳
- 回复链

### 3. 当前用户会话 (currentUser)
存储键：`currentUser`

存储当前登录用户的信息：
- 用户ID
- 邮箱
- 姓名
- 角色
- 部门
- 最后活动时间

### 4. 用户列表 (users)
存储键：`users`

存储所有系统用户（用于管理员管理用户功能）：
- 用户名
- 密码（演示用途）
- 用户信息

## 默认用户账户

系统预置两个演示账户：

1. **演示用户**
   - 用户名：`demo`
   - 密码：`123`
   - 角色：产品经理

2. **管理员**
   - 用户名：`admin`
   - 密码：`3947`
   - 角色：系统管理员

## 数据导出与备份

### 导出所有数据
在浏览器控制台执行以下代码：

```javascript
// 导出所有数据
const allData = {
  projects: localStorage.getItem('projects_data'),
  comments: localStorage.getItem('comments_data'),
  users: localStorage.getItem('users'),
  currentUser: localStorage.getItem('currentUser')
};

// 创建下载链接
const dataStr = JSON.stringify(allData, null, 2);
const dataBlob = new Blob([dataStr], { type: 'application/json' });
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = 'project-data-backup-' + new Date().toISOString() + '.json';
link.click();
```

### 导入数据
在浏览器控制台执行以下代码（先准备好 JSON 数据）：

```javascript
// 假设你有一个 backupData 对象
const backupData = {
  projects: '...',
  comments: '...',
  users: '...',
  currentUser: '...'
};

// 导入数据
if (backupData.projects) localStorage.setItem('projects_data', backupData.projects);
if (backupData.comments) localStorage.setItem('comments_data', backupData.comments);
if (backupData.users) localStorage.setItem('users', backupData.users);
if (backupData.currentUser) localStorage.setItem('currentUser', backupData.currentUser);

// 刷新页面
location.reload();
```

### 清除所有数据
在浏览器控制台执行：

```javascript
localStorage.removeItem('projects_data');
localStorage.removeItem('comments_data');
localStorage.removeItem('users');
localStorage.removeItem('currentUser');
location.reload();
```

## 数据持久化

- 数据存储在浏览器的 localStorage 中
- 数据会一直保留，直到手动清除或清理浏览器数据
- 每次创建、更新或删除操作都会立即保存到 localStorage
- 不同浏览器的数据是独立的（Chrome 和 Firefox 不共享数据）
- 隐私/无痕模式下的数据在关闭窗口后会被清除

## 文件说明

### 原始 Supabase 版本（已备份）
- `useProjects_supabase.ts.bak` - 使用 Supabase 的项目管理
- `useAuth_supabase.ts.bak` - 使用 Supabase 的用户认证
- `useComments_supabase.ts.bak` - 使用 Supabase 的评论系统

### 当前 localStorage 版本
- `useProjects.ts` - 使用 localStorage 的项目管理
- `useAuth.ts` - 使用 localStorage 的用户认证
- `useComments.ts` - 使用 localStorage 的评论系统

### localStorage 独立版本（参考）
- `useProjects_localStorage.ts`
- `useAuth_localStorage.ts`
- `useComments_localStorage.ts`

## 注意事项

1. **存储限制**：localStorage 通常有 5-10MB 的存储限制，对于大量项目数据可能不够用

2. **数据安全**：localStorage 数据存储在浏览器中，任何能访问浏览器的人都能查看和修改

3. **无自动同步**：数据仅存储在本地，不会同步到其他设备或浏览器

4. **定期备份**：建议定期使用上述导出功能备份数据

5. **清理缓存**：清理浏览器缓存时请注意不要清除站点数据，否则会丢失所有项目数据

## 恢复 Supabase 版本

如需恢复使用 Supabase 数据库，可执行以下操作：

```bash
# 恢复原始文件
cp src/hooks/useProjects_supabase.ts.bak src/hooks/useProjects.ts
cp src/hooks/useAuth_supabase.ts.bak src/hooks/useAuth.ts
cp src/hooks/useComments_supabase.ts.bak src/hooks/useComments.ts

# 重新构建
npm run build
```
