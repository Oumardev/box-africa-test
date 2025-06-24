'use client';

import { useQuery } from '@tanstack/react-query';
import { taskUseCases } from '@/services/useCases/taskUseCases';
import { User } from '@/types/task';

export function useUsers() {
  const USERS_KEYS = {
    all: ['users'] as const,
    lists: () => [...USERS_KEYS.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...USERS_KEYS.lists(), filters] as const,
    details: () => [...USERS_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...USERS_KEYS.details(), id] as const,
  };

  // Hook pour récupérer les utilisateurs
  const useUsersList = () => {
    return useQuery({
      queryKey: USERS_KEYS.lists(),
      queryFn: async () => {
        const result = await taskUseCases.getUsers();
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      },
    });
  };

  // Fonction pour récupérer les données des utilisateurs de façon synchrone
  const getUsers = () => {
    // Cette fonction ne devrait pas être appelée directement dans un composant React
    // Utiliser useUsersList à la place pour respecter les règles des hooks React
    throw new Error(
      'getUsers ne doit pas être appelée directement. Utilisez useUsersList à la place pour respecter les règles des hooks React.',
    );
  };

  // Fonction utilitaire pour trouver un utilisateur par son ID
  const findUserById = (users: User[], userId: string | number | undefined) => {
    if (!userId || !users.length) return undefined;
    return users.find((user) => user.id.toString() === userId.toString());
  };

  return {
    useUsersList,
    getUsers,
    findUserById,
  };
}

export default useUsers;
