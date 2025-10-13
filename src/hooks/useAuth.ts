import { useState, useEffect } from 'react';
import { User, UserRole } from '../types/user';
import { supabase } from '../lib/supabase';

// 从 localStorage 加载用户数据
const loadUsersFromStorage = () => {
  try {
    const stored = localStorage.getItem('users');
    if (stored) {
      const users = JSON.parse(stored);
      // 将用户数据转换为登录用的格式
      const loginUsers: Record<string, { password: string; userData: Omit<User, 'id'> }> = {};
      users.forEach((user: any) => {
        loginUsers[user.username] = {
          password: user.password,
          userData: {
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
            joinedAt: new Date(user.joinedAt),
            lastActive: new Date(user.lastActive),
          }
        };
      });
      return loginUsers;
    }
  } catch (error) {
    console.error('Failed to load users from storage:', error);
  }
  return MOCK_USERS;
};

// Mock user data for demo purposes
const MOCK_USERS: Record<string, { password: string; userData: Omit<User, 'id'> }> = {
  'demo': {
    password: '123',
    userData: {
      email: 'demo@company.com',
      name: 'Demo User',
      role: 'product-manager-1',
      department: 'Product',
      joinedAt: new Date('2024-01-01'),
      lastActive: new Date(),
    }
  },
  'admin': {
    password: '3947',
    userData: {
      email: 'admin@company.com',
      name: 'System Administrator',
      role: 'admin',
      department: 'IT',
      joinedAt: new Date('2024-01-01'),
      lastActive: new Date(),
    }
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableUsers, setAvailableUsers] = useState(() => loadUsersFromStorage());

  // 监听 localStorage 变化，更新可用用户列表
  useEffect(() => {
    const handleStorageChange = () => {
      setAvailableUsers(loadUsersFromStorage());
    };

    window.addEventListener('storage', handleStorageChange);

    // 定期检查用户数据更新
    const interval = setInterval(() => {
      setAvailableUsers(loadUsersFromStorage());
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Convert date strings back to Date objects
      setUser({
        ...userData,
        joinedAt: new Date(userData.joinedAt),
        lastActive: new Date(userData.lastActive)
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证用户名和密码
    const mockUser = availableUsers[email]; // email parameter is now username
    if (!mockUser || mockUser.password !== password) {
      setIsLoading(false);
      return { success: false, error: 'Invalid username or password' };
    }

    const userId = Math.random().toString(36).substr(2, 9);

    const userData: User = {
      id: userId,
      ...mockUser.userData,
      role: mockUser.userData.role === 'admin' ? 'admin' : role, // Admin role is fixed, others can be selected
      name: mockUser.userData.role === 'admin' ? mockUser.userData.name : `${mockUser.userData.name} (${role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())})`,
      lastActive: new Date(),
    };

    // 将用户信息同步到Supabase
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', userData.email)
        .maybeSingle();

      if (existingUser) {
        // 更新现有用户
        await supabase
          .from('users')
          .update({
            name: userData.name,
            role: userData.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id);

        // 使用数据库中的ID
        userData.id = existingUser.id;
      } else {
        // 创建新用户
        await supabase
          .from('users')
          .insert({
            id: userId,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            department: userData.department,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error syncing user to Supabase:', error);
      // 即使Supabase同步失败，也继续登录
    }

    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setIsLoading(false);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
