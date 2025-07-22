import { useState, useEffect } from 'react';
import { User, PaginatedResponse } from '../types';
import { userService } from '../services/api';

export const useUsers = (page = 1, limit = 10) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<User> = await userService.getUsers(page, limit);
      setUsers(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const refetch = () => {
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    pagination,
    refetch,
  };
};