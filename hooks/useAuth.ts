import { useState, useEffect } from 'react';
import { User, UserRole } from '../types/user';

// Mock user data for demo purposes
const MOCK_USERS: Record<string, { password: string; userData: Omit<User, 'id'> }> = {
  'demo@company.com': {
    password: 'demo123',
    userData: {
      email: 'demo@company.com',
      name: 'Demo User',
      role: 'product-manager-1',
      department: 'Product',
      joinedAt: new Date('2024-01-01'),
      lastActive: new Date(),
    }
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = MOCK_USERS[email];
    if (!mockUser || mockUser.password !== password) {
      setIsLoading(false);
      return { success: false, error: 'Invalid email or password' };
    }
    
    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...mockUser.userData,
      role, // Use the selected role
      name: `${mockUser.userData.name} (${role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())})`,
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