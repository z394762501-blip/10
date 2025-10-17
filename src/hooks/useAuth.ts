import { useState, useEffect } from 'react';
import { User, UserRole } from '../types/user';

const loadUsersFromStorage = () => {
  try {
    const stored = localStorage.getItem('users');
    if (stored) {
      const users = JSON.parse(stored);
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

  useEffect(() => {
    const handleStorageChange = () => {
      setAvailableUsers(loadUsersFromStorage());
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      setAvailableUsers(loadUsersFromStorage());
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser({
        ...userData,
        joinedAt: new Date(userData.joinedAt),
        lastActive: new Date(userData.lastActive)
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: UserRole): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = availableUsers[email];
    if (!mockUser || mockUser.password !== password) {
      setIsLoading(false);
      return { success: false, error: 'Invalid username or password' };
    }

    const userId = Math.random().toString(36).substr(2, 9);

    const userData: User = {
      id: userId,
      ...mockUser.userData,
      role: mockUser.userData.role,
      name: mockUser.userData.name,
      lastActive: new Date(),
    };

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
