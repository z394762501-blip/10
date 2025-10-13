import React, { useState } from 'react';
import { User, LogIn, Mail, Lock, Users } from 'lucide-react';
import { UserRole } from '../types/user';

interface LoginFormProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
  isLoading?: boolean;
  error?: string;
}

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  { value: 'designer', label: 'Designer', description: 'UI/UX Design Team' },
  { value: 'product-manager-1', label: 'Product Manager 1', description: 'Senior Product Manager' },
  { value: 'product-manager-2', label: 'Product Manager 2', description: 'Product Manager - Features' },
  { value: 'product-manager-3', label: 'Product Manager 3', description: 'Product Manager - Strategy' },
  { value: 'sponsor', label: 'Sponsor', description: 'Executive Sponsor' },
  { value: 'operator-1', label: 'Operator 1', description: 'Operations Lead' },
  { value: 'operator-2', label: 'Operator 2', description: 'Operations Specialist' },
  { value: 'operator-3', label: 'Operator 3', description: 'Operations Coordinator' },
];

export default function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('product-manager-1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, selectedRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Project Management Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to access your project dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Role
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Email: demo@company.com</p>
            <p>Password: demo123</p>
            <p>Select any role to explore different permissions</p>
          </div>
        </div>
      </div>
    </div>
  );
}