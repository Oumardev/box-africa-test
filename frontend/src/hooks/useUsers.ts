'use client';

import { useQuery } from '@tanstack/react-query';
import { taskUseCases } from '@/services/useCases/taskUseCases';

export function useUsers() {
  const USERS_KEYS = {
    all: ['users'] as const,
    lists: () => [...USERS_KEYS.all, 'list'] as const,
    list: (filters: any) => [...USERS_KEYS.lists(), filters] as const,
    details: () => [...USERS_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...USERS_KEYS.details(), id] as const,
  };

  const getUsers = () => {
    return useQuery({
      queryKey: USERS_KEYS.lists(),
      queryFn: async () => {
        const result = await taskUseCases.getUsers();
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      }
    });
  };

  const findUserById = (users: any[], userId: string | number | undefined) => {
    if (!userId || !users.length) return undefined;
    return users.find(user => user.id.toString() === userId.toString());
  };

  return {
    getUsers,
    findUserById,
  };
}

export default useUsers;
