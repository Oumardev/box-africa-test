/**
 * Types pour le système de gestion de tâches
 */

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user?: User;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  assigneeId?: string;
  assignee?: User;
  creatorId: string;
  creator?: User;
  tags: string[];
  comments: TaskComment[];
  attachments: string[];
}

/**
 * Interface pour le formulaire de création/édition des tâches
 * Ces valeurs peuvent être converties en Task avant l'envoi à l'API
 */
export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | undefined;
  assigneeId?: string | undefined;
  tags?: string[];
  // Pour l'API fictive et la compatibilité avec les mutations
  creatorId?: string;
}

/**
 * Interface pour les filtres de tâches
 */
export interface TaskFilter {
  // Filtres simples pour les versions de base
  status?: TaskStatus | TaskStatus[] | 'all' | null;
  priority?: TaskPriority | TaskPriority[] | 'all' | null;
  assigneeId?: string | string[] | null;
  creatorId?: string | string[] | null;
  tags?: string[] | null;
  search?: string | null;
  dueDateFrom?: Date | null;
  dueDateTo?: Date | null;
}
