import React from 'react';
import { User, LogOut, Settings, Bell } from 'lucide-react';
import { User as UserType } from '../types/user';

interface UserProfileProps {
  user: UserType;
  onLogout: () => void;
}

const ROLE_COLORS = {
  'designer': 'bg-purple-100 text-purple-800',
  'product-manager-1': 'bg-blue-100 text-blue-800',
  'product-manager-2': 'bg-blue-100 text-blue-800',
  'product-manager-3': 'bg-blue-100 text-blue-800',
  'sponsor': 'bg-green-100 text-green-800',
  'operator-1': 'bg-amber-100 text-amber-800',
  'operator-2': 'bg-amber-100 text-amber-800',
  'operator-3': 'bg-amber-100 text-amber-800',
};

const ROLE_LABELS = {
  'designer': 'Designer',
  'product-manager-1': 'Product Manager 1',
  'product-manager-2': 'Product Manager 2',
  'product-manager-3': 'Product Manager 3',
  'sponsor': 'Executive Sponsor',
  'operator-1': 'Operations Lead',
  'operator-2': 'Operations Specialist',
  'operator-3': 'Operations Coordinator',
};

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
          ) : (
            <User className="w-5 h-5 text-gray-600" />
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className={`text-xs px-2 py-1 rounded-full ${ROLE_COLORS[user.role]}`}>
            {ROLE_LABELS[user.role]}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={onLogout}
          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}