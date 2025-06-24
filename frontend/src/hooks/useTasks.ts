'use client';

import { Task, TaskFilter, TaskFormValues, TaskPriority, TaskStatus } from '@/types/task';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { taskUseCases } from '@/services/useCases/taskUseCases';
import { toast } from 'sonner';
import { useFilter } from '@/context/FilterContext';

/**
 * Hook personnalisé pour gérer les tâches via React Query
 * Utilise le FilterContext pour centraliser l'état du filtre
 */
export const useTasks = () => {
  const queryClient = useQueryClient();

  // Utiliser le contexte de filtre global
  const { filter, setFilter, resetFilters } = useFilter();

  // Clés de cache React Query
  const TASKS_KEYS = {
    all: ['tasks'] as const,
    lists: () => [...TASKS_KEYS.all, 'list'] as const,
    list: (filters: any) => [...TASKS_KEYS.lists(), { filters }] as const,
    details: () => [...TASKS_KEYS.all, 'detail'] as const,
    detail: (id: string | number) => [...TASKS_KEYS.details(), id] as const,
  };

  // Récupérer toutes les tâches puis appliquer les filtres sur le résultat
  const { data: allTasks = [], isLoading, error, refetch } = useQuery({
    queryKey: TASKS_KEYS.all,
    queryFn: async () => {
      const result = await taskUseCases.getAllTasks();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
  
  // Force la réactivité - Cette clé change quand les filtres changent
  const filterKey = JSON.stringify(filter);

  // Appliquer les filtres sur les tâches récupérées
  const filteredTasks = useMemo(() => {
    // Ne filtrer que si allTasks existe et contient des éléments
    if (!allTasks || allTasks.length === 0) {
      return [];
    }

    let filteredResult = [...allTasks]; // Copie des tâches pour le filtrage
    let tasksRemovedByFilter = {
      byStatus: 0,
      byPriority: 0,
      byAssignee: 0,
      bySearch: 0
    };

    // 1. Filtrage par statut
    if (filter.status && filter.status !== 'all') {
      const initialCount = filteredResult.length;
      
      filteredResult = filteredResult.filter(task => task.status === filter.status);
      
      tasksRemovedByFilter.byStatus = initialCount - filteredResult.length;
    }

    // 2. Filtrage par priorité
    if (filter.priority && filter.priority !== 'all') {
      const initialCount = filteredResult.length;
      
      filteredResult = filteredResult.filter(task => task.priority === filter.priority);
      
      tasksRemovedByFilter.byPriority = initialCount - filteredResult.length;
    }

    // 3. Filtrage par assigné
    if (filter.assigneeId) {
      const initialCount = filteredResult.length;
      
      if (filter.assigneeId === 'unassigned') {
        filteredResult = filteredResult.filter(task => !task.assigneeId);
      } else if (filter.assigneeId !== 'all_assignees') {
        filteredResult = filteredResult.filter(task => task.assigneeId === filter.assigneeId);
      }
      
      tasksRemovedByFilter.byAssignee = initialCount - filteredResult.length;
    }

    // 4. Filtrage par recherche textuelle
    if (filter.search && filter.search.trim() !== '') {
      const query = filter.search.toLowerCase().trim();
      const initialCount = filteredResult.length;
      
      filteredResult = filteredResult.filter(task => {
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description && task.description.toLowerCase().includes(query);
        return titleMatch || descMatch;
      });
      
      tasksRemovedByFilter.bySearch = initialCount - filteredResult.length;
    }

    return filteredResult;
  }, [allTasks, filter, filterKey]);

  const getTask = (id: number | string) => {
    return useQuery({
      queryKey: TASKS_KEYS.detail(id),
      queryFn: async () => {
        const result = await taskUseCases.getTaskById(Number(id));
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      },
      enabled: !!id,
    });
  };

  const createTask = useMutation({
    mutationFn: (taskData: TaskFormValues) => {
      return taskUseCases.createTask(taskData);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: TASKS_KEYS.all });
        toast.success('Tâche créée avec succès');
      }
    },
    onError: () => {
      toast.error('Erreur lors de la création de la tâche');
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) => {
      return taskUseCases.updateTask(id, data);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: TASKS_KEYS.all });
        toast.success('Tâche mise à jour avec succès');
      }
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour de la tâche');
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: number) => {
      return taskUseCases.deleteTask(id);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: TASKS_KEYS.all });
        toast.success('Tâche supprimée avec succès');
      }
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de la tâche');
    },
  });

  // Note: updateFilter et resetFilters viennent du FilterContext

  // Compter les filtres actifs
  const activeFiltersCount = useMemo(() => {
    return Object.entries(filter).filter(
      ([key, value]) => {
        // Si la clé est search, vérifier qu'elle n'est pas vide
        if (key === 'search') return value && value.trim() !== '';
        // Pour les autres filtres, vérifier qu'ils ne sont ni null ni undefined
        return value !== null && value !== undefined;
      }
    ).length;
  }, [filter]);

  // Log du filtre actuel pour débogage
  console.log('Filtres actuels dans useTasks:', filter);

  // Log avant de retourner l'objet pour voir ce qui est passé au composant
  console.log('HOOK: RETOURNE FILTEREDTASKS AVEC', filteredTasks.length, 'ELEMENTS');
  
  return {
    // Nouvelle API plus simple
    data: filteredTasks,
    isLoading,
    error,
    refetch,
    // Exposer l'API standard pour la rétro-compatibilité
    getTasks: () => {
      console.log('APPEL A GETTASKS(): RETOURNE', filteredTasks.length, 'TACHES FILTREES');
      return { data: filteredTasks, isLoading, error, refetch };
    },
    getTask,
    createTask,
    updateTask,
    deleteTask,
    // Exposer les filtres et leur gestion
    filter,
    activeFiltersCount
  };
};

export default useTasks;
