import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types/user';
import { Users, CreditCard as Edit3, Save, X, Plus, Trash2, Key, Shield } from 'lucide-react';

// 从 localStorage 加载用户数据
const loadUsersFromStorage = (): UserData[] => {
  try {
    const stored = localStorage.getItem('users');
    if (stored) {
      const users = JSON.parse(stored);
      // Convert date strings back to Date objects
      return users.map((user: any) => ({
        ...user,
        joinedAt: new Date(user.joinedAt),
        lastActive: new Date(user.lastActive)
      }));
    }
    return MOCK_USERS_DATA;
  } catch (error) {
    console.error('Failed to load users from storage:', error);
    return MOCK_USERS_DATA;
  }
};

// 保存用户数据到 localStorage
const saveUsersToStorage = (users: UserData[]) => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to storage:', error);
  }
};

interface UserManagementProps {
  currentUser: User;
}

// Mock users data - in a real app this would come from a backend
const MOCK_USERS_DATA = [
  {
    id: '1',
    email: 'demo@company.com',
    name: 'Demo User',
    username: 'demo',
    role: 'product-manager-1' as UserRole,
    department: 'Product',
    joinedAt: new Date('2024-01-01'),
    lastActive: new Date(),
    password: '123'
  },
  {
    id: '2',
    email: 'admin@company.com',
    name: 'System Administrator',
    username: 'admin',
    role: 'admin' as UserRole,
    department: 'IT',
    joinedAt: new Date('2024-01-01'),
    lastActive: new Date(),
    password: '3947'
  }
];

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'designer', label: 'Designer' },
  { value: 'product-manager-1', label: 'Product Manager 1' },
  { value: 'product-manager-2', label: 'Product Manager 2' },
  { value: 'product-manager-3', label: 'Product Manager 3' },
  { value: 'sponsor', label: 'Executive Sponsor' },
  { value: 'operator-1', label: 'Operations Lead' },
  { value: 'operator-2', label: 'Operations Specialist' },
  { value: 'operator-3', label: 'Operations Coordinator' },
  { value: 'admin', label: 'System Administrator' },
];

const ROLE_COLORS = {
  'designer': 'bg-purple-100 text-purple-800',
  'product-manager-1': 'bg-blue-100 text-blue-800',
  'product-manager-2': 'bg-blue-100 text-blue-800',
  'product-manager-3': 'bg-blue-100 text-blue-800',
  'sponsor': 'bg-green-100 text-green-800',
  'operator-1': 'bg-amber-100 text-amber-800',
  'operator-2': 'bg-amber-100 text-amber-800',
  'operator-3': 'bg-amber-100 text-amber-800',
  'admin': 'bg-red-100 text-red-800',
};

interface UserData {
  id: string;
  email: string;
  name: string;
  username: string;
  role: UserRole;
  department: string;
  joinedAt: Date;
  lastActive: Date;
  password: string;
}

export default function UserManagement({ currentUser }: UserManagementProps) {
  const [users, setUsers] = useState<UserData[]>(() => loadUsersFromStorage());
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [addingUser, setAddingUser] = useState(false);
  const [editData, setEditData] = useState<Partial<UserData>>({});

  // 每当用户数据变化时保存到 localStorage
  useEffect(() => {
    saveUsersToStorage(users);
  }, [users]);
  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditData(user);
      setEditingUser(userId);
    }
  };

  const handleAddUser = () => {
    setEditData({
      name: '',
      username: '',
      email: '',
      role: 'operator-1',
      department: '',
      password: ''
    });
    setAddingUser(true);
  };

  const handleSaveUser = () => {
    if (addingUser) {
      const newUser: UserData = {
        id: Math.random().toString(36).substr(2, 9),
        name: editData.name || '',
        username: editData.username || '',
        email: editData.email || '',
        role: editData.role || 'operator-1',
        department: editData.department || '',
        password: editData.password || '123',
        joinedAt: new Date(),
        lastActive: new Date(),
      };
      setUsers(prev => [...prev, newUser]);
      setAddingUser(false);
    } else if (editingUser) {
      setUsers(prev => prev.map(user => 
        user.id === editingUser 
          ? { ...user, ...editData, lastActive: new Date() }
          : user
      ));
      setEditingUser(null);
    }
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setAddingUser(false);
    setEditData({});
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert('You cannot delete your own account');
      return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const getRoleLabel = (role: UserRole) => {
    return ROLE_OPTIONS.find(r => r.value === role)?.label || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
          </div>
        </div>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {addingUser && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveUser}
                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={editData.username || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Username for login"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editData.email || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={editData.department || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Department"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={editData.role || 'operator-1'}
                onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {ROLE_OPTIONS.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="text"
                value={editData.password || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Password"
              />
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Users ({users.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user.id} className="p-6">
              {editingUser === user.id ? (
                // Edit Mode
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Edit User</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveUser}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        value={editData.username || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input
                        type="text"
                        value={editData.department || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={editData.role || user.role}
                        onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {ROLE_OPTIONS.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="text"
                        value={editData.password || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Leave empty to keep current password"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-semibold text-gray-900">{user.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                          {getRoleLabel(user.role)}
                        </span>
                        {user.role === 'admin' && (
                          <Shield className="w-4 h-4 text-red-500" title="Administrator" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Username: <span className="font-medium">{user.username}</span></p>
                        <p>Email: {user.email}</p>
                        <p>Department: {user.department}</p>
                        <p>Password: <span className="font-mono bg-gray-100 px-1 rounded">{user.password}</span></p>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Joined: {user.joinedAt.toLocaleDateString()} • 
                        Last active: {user.lastActive.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditUser(user.id)}
                      className="text-gray-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50"
                      title="Edit user"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    {user.id !== currentUser.id && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
                        title="Delete user"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}