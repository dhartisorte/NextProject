'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, CreateUserRequest, UpdateUserRequest, PaginatedResponse } from '@/types';
import { userApi } from '@/lib/api';

export const useUsers = (initialPage: number = 1, initialLimit: number = 10) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = useCallback(async (page: number = pagination.page, limit: number = pagination.limit) => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<User> = await userApi.getUsers(page, limit);
      
      setUsers(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      console.error('Error fetching users:', err);
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the backend server. Please make sure your backend is running on http://localhost:3000');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const createUser = async (userData: CreateUserRequest): Promise<User | null> => {
    try {
      setError(null);
      const newUser = await userApi.createUser(userData);
      await fetchUsers(); // Refresh the list
      return newUser;
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.message || 'Failed to create user');
      return null;
    }
  };

  const updateUser = async (id: string, userData: UpdateUserRequest): Promise<User | null> => {
    try {
      setError(null);
      const updatedUser = await userApi.updateUser(id, userData);
      await fetchUsers(); // Refresh the list
      return updatedUser;
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update user');
      return null;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await userApi.deleteUser(id);
      await fetchUsers(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
      return false;
    }
  };

  const changePage = (newPage: number) => {
    fetchUsers(newPage, pagination.limit);
  };

  const changeLimit = (newLimit: number) => {
    fetchUsers(1, newLimit);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    changePage,
    changeLimit,
    refetch: fetchUsers,
  };
};