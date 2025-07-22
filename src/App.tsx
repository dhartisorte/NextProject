import React, { useState } from 'react';
import { UserCard } from './components/UserCard';
import { UserForm } from './components/UserForm';
import { Pagination } from './components/Pagination';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useUsers } from './hooks/useUsers';
import { userService } from './services/api';
import { User, CreateUserRequest } from './types';
import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const { users, loading, error, pagination, refetch } = useUsers(currentPage, 10);

  const handleCreateUser = async (userData: CreateUserRequest) => {
    setFormLoading(true);
    try {
      await userService.createUser(userData);
      refetch();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUser = async (userData: CreateUserRequest) => {
    if (!editingUser) return;
    
    setFormLoading(true);
    try {
      await userService.updateUser(editingUser.id, userData);
      refetch();
      setEditingUser(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await userService.deleteUser(id);
      refetch();
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
          <p className="text-gray-600 mb-4">
            Unable to connect to the backend server. Please make sure your backend is running on{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code>
          </p>
          <button
            onClick={refetch}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <UsersIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">Manage your application users</p>
              </div>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : pagination.total}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 text-green-600 font-bold flex items-center justify-center">
                  #
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Page</p>
                <p className="text-2xl font-bold text-gray-900">{currentPage}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="w-6 h-6 text-purple-600 font-bold flex items-center justify-center">
                  📄
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : pagination.totalPages}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first user.</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn-primary"
            >
              Create User
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div key={user.id} className="relative">
                  {deleteLoading === user.id && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                      <LoadingSpinner />
                    </div>
                  )}
                  <UserCard
                    user={user}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </>
        )}

        {/* User Form Modal */}
        <UserForm
          user={editingUser}
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          loading={formLoading}
        />
      </div>
    </div>
  );
}

export default App;