/**
 * Use Cases pour la gestion des tâches
 * Couche d'abstraction entre les composants UI et les services API
 */

import { Task, TaskFormValues, User } from '@/types/task';
import apiService from '@/services/api/apiService';
import { toast } from 'sonner';

/**
 * Interface pour définir les résultats des opérations
 */
export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Use Cases pour les opérations sur les tâches
 */
export const taskUseCases = {
  /**
   * Récupère toutes les tâches avec gestion d'erreur
   */
  async getAllTasks(): Promise<OperationResult<Task[]>> {
    try {
      const tasks = await apiService.getTasks();
      return { success: true, data: tasks };
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(`Erreur: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage || 'Erreur lors de la récupération des tâches',
      };
    }
  },

  /**
   * Récupère une tâche par son ID avec gestion d'erreur
   */
  async getTaskById(id: number): Promise<OperationResult<Task>> {
    try {
      const task = await apiService.getTask(id);
      return { success: true, data: task };
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(`Erreur: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage || `Erreur lors de la récupération de la tâche ${id}`,
      };
    }
  },

  /**
   * Crée une nouvelle tâche avec gestion d'erreur
   */
  async createTask(taskData: TaskFormValues): Promise<OperationResult<Task>> {
    try {
      // Augmentation des données avant l'envoi à l'API
      const augmentedData = {
        ...taskData,
        comments: [],
        attachments: [],
      };

      const task = await apiService.createTask(augmentedData);
      toast.success('Tâche créée avec succès');
      return { success: true, data: task };
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(`Erreur: ${errorMessage}`);
      return { success: false, error: errorMessage || 'Erreur lors de la création de la tâche' };
    }
  },

  /**
   * Met à jour une tâche existante avec gestion d'erreur
   */
  async updateTask(id: number, taskData: Partial<Task>): Promise<OperationResult<Task>> {
    try {
      const task = await apiService.updateTask(id, taskData);
      toast.success('Tâche mise à jour avec succès');
      return { success: true, data: task };
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(`Erreur: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage || `Erreur lors de la mise à jour de la tâche ${id}`,
      };
    }
  },

  /**
   * Supprime une tâche avec gestion d'erreur
   */
  async deleteTask(id: number): Promise<OperationResult<void>> {
    try {
      await apiService.deleteTask(id);
      toast.success('Tâche supprimée avec succès');
      return { success: true };
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(`Erreur: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage || `Erreur lors de la suppression de la tâche ${id}`,
      };
    }
  },

  /**
   * Récupère les utilisateurs pour l'assignation de tâches
   */
  async getUsers(): Promise<OperationResult<User[]>> {
    try {
      const users = await apiService.getUsers();
      return { success: true, data: users };
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(`Erreur: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage || 'Erreur lors de la récupération des utilisateurs',
      };
    }
  },
};

export default taskUseCases;
