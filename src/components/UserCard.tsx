'use client';

import { User } from '@/types';
import { useState } from 'react';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsDeleting(true);
      await onDelete(user.id);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
          <p className="text-gray-600 mb-2">{user.email}</p>
          {user.age && (
            <p className="text-sm text-gray-500 mb-2">Age: {user.age}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 border-t pt-3">
        <p>Created: {formatDate(user.createdAt)}</p>
        {user.updatedAt && user.updatedAt !== user.createdAt && (
          <p>Updated: {formatDate(user.updatedAt)}</p>
        )}
      </div>
    </div>
  );
}

export { UserCard }