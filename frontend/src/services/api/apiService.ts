/**
 * Service API principal pour communiquer avec le backend
 * Encapsule toutes les requêtes HTTP
 */

import { Task, TaskFormValues } from '@/types/task';

const API_URL = 'http://localhost:3001';

/**
 * Configuration pour les requêtes fetch
 */
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer fake-jwt-token', // Token fictif pour démonstration
};

/**
 * Gestion générique des erreurs API
 */
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    // Récupération des détails de l'erreur depuis la réponse
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur API: ${response.status}`);
    } catch (error) {
      // En cas d'erreur lors du parsing JSON
      throw new Error(`Erreur API: ${response.status}`);
    }
  }
  return response;
};

/**
 * Service qui expose les méthodes pour interagir avec l'API
 */
export const apiService = {
  /**
   * Récupère toutes les tâches
   */
  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'GET',
        headers: defaultHeaders,
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  },

  /**
   * Récupère une tâche par son ID
   */
  async getTask(id: number): Promise<Task> {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'GET',
        headers: defaultHeaders,
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération de la tâche ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle tâche
   */
  async createTask(task: TaskFormValues): Promise<Task> {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(task),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  },

  /**
   * Met à jour une tâche existante
   */
  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(task),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la tâche ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime une tâche
   */
  async deleteTask(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: defaultHeaders,
      });
      
      await handleApiError(response);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la tâche ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère tous les utilisateurs
   */
  async getUsers() {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: defaultHeaders,
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }
};

export default apiService;
