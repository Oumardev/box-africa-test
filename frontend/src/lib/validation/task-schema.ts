import { z } from 'zod';
import { TaskPriority, TaskStatus } from '@/types/task';

/**
 * Schéma de validation pour la création et l'édition des tâches
 */
export const taskSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Le titre doit comporter au moins 3 caractères' })
    .max(100, { message: 'Le titre ne peut pas dépasser 100 caractères' }),
  
  description: z
    .string()
    .min(10, { message: 'La description doit comporter au moins 10 caractères' })
    .max(1000, { message: 'La description ne peut pas dépasser 1000 caractères' }),
  
  status: z.enum(['todo', 'in_progress', 'review', 'completed', 'cancelled'] as const, {
    required_error: 'Veuillez sélectionner un statut',
  }),
  
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const, {
    required_error: 'Veuillez sélectionner une priorité',
  }),
  
  dueDate: z.date().nullable().optional(),
  
  assigneeId: z.string().optional(),
  
  tags: z.array(z.string()).optional().default([]),
});

/**
 * Type inféré du schéma de tâche pour les formulaires
 */
export type TaskFormValues = z.infer<typeof taskSchema>;

/**
 * Options pour les statuts de tâche dans les listes déroulantes
 */
export const taskStatusOptions: { label: string; value: TaskStatus }[] = [
  { label: 'À faire', value: 'todo' },
  { label: 'En cours', value: 'in_progress' },
  { label: 'En revue', value: 'review' },
  { label: 'Terminé', value: 'completed' },
  { label: 'Annulé', value: 'cancelled' },
];

/**
 * Options pour les priorités de tâche dans les listes déroulantes
 */
export const taskPriorityOptions: { label: string; value: TaskPriority }[] = [
  { label: 'Basse', value: 'low' },
  { label: 'Moyenne', value: 'medium' },
  { label: 'Haute', value: 'high' },
  { label: 'Urgente', value: 'urgent' },
];

/**
 * Utilisateurs fictifs pour l'assignation des tâches
 */
export const mockUsers = [
  { id: 'user1', name: 'John Doe', email: 'john@example.com' },
  { id: 'user2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: 'user3', name: 'Robert Johnson', email: 'robert@example.com' },
  { id: 'user4', name: 'Emily Williams', email: 'emily@example.com' },
];
