import React, { useState } from 'react';
import { X, Plus, FolderPlus } from 'lucide-react';
import { User } from '../types/user';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, createdBy: User) => void;
  currentUser: User;
}

export default function ProjectCreationModal({ 
  isOpen, 
  onClose, 
  onCreateProject, 
  currentUser 
}: ProjectCreationModalProps) {
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setIsCreating(true);
    try {
      onCreateProject(projectName.trim(), currentUser);
      setProjectName('');
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setProjectName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name..."
              required
              autoFocus
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Project Template</h3>
            <p className="text-sm text-blue-700">
              Your new project will be created with 5 phases, each containing editable content areas and attachment capabilities.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!projectName.trim() || isCreating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
            >
              {isCreating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {isCreating ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}