import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Task, TaskStatus, TaskPriority } from '@/types/task';

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  filters: {
    searchQuery: string | null;
    status: TaskStatus | null;
    priority: TaskPriority | null;
    assigneeId: string | null;
    dueDateFrom: Date | null;
    dueDateTo: Date | null;
  };
  isLoading: boolean;
  error: string | null;
}

interface TaskActions {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskAssignee: (id: string, assigneeId: string | undefined) => void;
  deleteTask: (id: string) => void;

  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  setAssigneeFilter: (assigneeId: string) => void;
  resetFilters: () => void;
  getFilteredTasks: () => Task[];

  fetchTasks: () => Promise<void>;
}

type TaskStore = TaskState & TaskActions;
const generateId = () => Math.random().toString(36).substr(2, 9);
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implémenter le système de thèmes',
    description: 'Créer un système permettant de basculer entre Material UI et ShadCN',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(2025, 5, 30),
    createdAt: new Date(2025, 5, 20),
    updatedAt: new Date(2025, 5, 22),
    creatorId: 'user1',
    creator: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
    },
    assigneeId: 'user1',
    assignee: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
    },
    tags: ['frontend', 'ui'],
    comments: [],
    attachments: [],
  },
  {
    id: '2',
    title: 'Créer les composants de tâche',
    description: 'Développer les composants pour afficher et éditer les tâches',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date(2025, 6, 5),
    createdAt: new Date(2025, 5, 25),
    updatedAt: new Date(2025, 5, 25),
    creatorId: 'user1',
    creator: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
    },
    assigneeId: 'user2',
    assignee: {
      id: 'user2',
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    tags: ['frontend', 'component'],
    comments: [],
    attachments: [],
  },
  {
    id: '3',
    title: 'Intégrer le store Zustand',
    description: 'Mettre en place la gestion d\'état avec Zustand pour les tâches',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(2025, 6, 10),
    createdAt: new Date(2025, 5, 28),
    updatedAt: new Date(2025, 5, 28),
    creatorId: 'user2',
    creator: {
      id: 'user2',
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    tags: ['frontend', 'state-management'],
    comments: [],
    attachments: [],
  },
];

export const useTaskStore = create<TaskStore>()(
  immer((set, get) => ({
    tasks: [],
    filteredTasks: [],
    filters: {
      searchQuery: null,
      status: null,
      priority: null,
      assigneeId: null,
      dueDateFrom: null,
      dueDateTo: null,
    },
    isLoading: false,
    error: null,

    addTask: (taskData) => {
      const newTask: Task = {
        id: generateId(),
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
        attachments: [],
      };

      set((state) => {
        state.tasks.push(newTask);
        state.filteredTasks = filterTasks(state.tasks, state.filters);
      });
    },

    updateTask: (id, updates) => {
      set((state) => {
        const taskIndex = state.tasks.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = {
            ...state.tasks[taskIndex],
            ...updates,
            updatedAt: new Date(),
          };
          state.filteredTasks = filterTasks(state.tasks, state.filters);
        }
      });
    },

    updateTaskAssignee: (id, assigneeId: string | undefined) => {
      set((state) => {
        const taskIndex = state.tasks.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = {
            ...state.tasks[taskIndex],
            assigneeId: assigneeId === null ? undefined : assigneeId,
            updatedAt: new Date(),
          };
          state.filteredTasks = filterTasks(state.tasks, state.filters);
        }
      });
    },

    deleteTask: (id) => {
      set((state) => {
        state.tasks = state.tasks.filter((task) => task.id !== id);
        state.filteredTasks = filterTasks(state.tasks, state.filters);
      });
    },
    setSearchQuery: (query) => {
      set((state) => {
        state.filters.searchQuery = query || null;
        state.filteredTasks = filterTasks(state.tasks, state.filters);
      });
    },

    setStatusFilter: (status) => {
      set((state) => {
        state.filters.status = status as TaskStatus || null;
        state.filteredTasks = filterTasks(state.tasks, state.filters);
      });
    },

    setPriorityFilter: (priority) => {
      set((state) => {
        state.filters.priority = priority as TaskPriority || null;
        state.filteredTasks = filterTasks(state.tasks, state.filters);
      });
    },

    setAssigneeFilter: (assigneeId) => {
      set((state) => {
        state.filters.assigneeId = assigneeId || null;
        state.filteredTasks = filterTasks(state.tasks, state.filters);
      });
    },

    resetFilters: () => {
      set((state) => {
        state.filters = {
          searchQuery: null,
          status: null,
          priority: null,
          assigneeId: null,
          dueDateFrom: null,
          dueDateTo: null,
        };
        state.filteredTasks = [...state.tasks];
      });
    },

    getFilteredTasks: () => {
      const state = get();
      return filterTasks(state.tasks, state.filters);
    },

    fetchTasks: async () => {
      set({ isLoading: true, error: null });
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        set((state) => {
          state.tasks = mockTasks;
          state.filteredTasks = mockTasks;
          state.isLoading = false;
        });
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Une erreur est survenue',
          isLoading: false,
        });
      }
    },
  }))
);

function filterTasks(tasks: Task[], filters: TaskState['filters']): Task[] {
  return tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) {
      return false;
    }
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }
    if (filters.assigneeId) {
      if (filters.assigneeId === 'unassigned' && task.assigneeId) {
        return false;
      }
      else if (filters.assigneeId !== 'unassigned' && task.assigneeId !== filters.assigneeId) {
        return false;
      }
    }
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    if (filters.dueDateFrom && task.dueDate && new Date(task.dueDate) < new Date(filters.dueDateFrom)) {
      return false;
    }
    if (filters.dueDateTo && task.dueDate && new Date(task.dueDate) > new Date(filters.dueDateTo)) {
      return false;
    }

    return true;
  });
}
