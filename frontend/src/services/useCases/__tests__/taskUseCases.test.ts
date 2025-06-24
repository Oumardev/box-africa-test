import { taskUseCases } from '../taskUseCases';
import apiService from '@/services/api/apiService';
import { toast } from 'sonner';

jest.mock('@/services/api/apiService');
jest.mock('sonner');

describe('Task Use Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('devrait récupérer avec succès toutes les tâches', async () => {
      const mockTasks = [
        { id: 1, title: 'Tâche 1' },
        { id: 2, title: 'Tâche 2' }
      ];
      (apiService.getTasks as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskUseCases.getAllTasks();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTasks);
      expect(apiService.getTasks).toHaveBeenCalledTimes(1);
    });

    it('devrait gérer les erreurs lors de la récupération des tâches', async () => {
      const errorMessage = 'Erreur de connexion';
      (apiService.getTasks as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await taskUseCases.getAllTasks();
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
  });

  describe('getTaskById', () => {
    it('devrait récupérer une tâche par son ID', async () => {
      const mockTask = { id: 1, title: 'Tâche 1' };
      (apiService.getTask as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskUseCases.getTaskById(1);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTask);
      expect(apiService.getTask).toHaveBeenCalledWith(1);
    });

    it('devrait gérer les erreurs lors de la récupération d\'une tâche', async () => {
      const errorMessage = 'Tâche non trouvée';
      (apiService.getTask as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await taskUseCases.getTaskById(999);
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
  });

  describe('createTask', () => {
    it('devrait créer une nouvelle tâche avec succès', async () => {
      const taskData = {
        title: 'Nouvelle tâche',
        description: 'Description',
        status: 'todo',
        priority: 'medium'
      };
      const createdTask = { id: 3, ...taskData, comments: [], attachments: [] };
      (apiService.createTask as jest.Mock).mockResolvedValue(createdTask);

      const result = await taskUseCases.createTask(taskData as any);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdTask);
      expect(apiService.createTask).toHaveBeenCalledWith(expect.objectContaining({
        ...taskData,
        comments: [],
        attachments: []
      }));
      expect(toast.success).toHaveBeenCalledWith('Tâche créée avec succès');
    });

    it('devrait gérer les erreurs lors de la création d\'une tâche', async () => {
      const errorMessage = 'Validation échouée';
      (apiService.createTask as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await taskUseCases.createTask({} as any);
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
  });

  describe('updateTask', () => {
    it('devrait mettre à jour une tâche avec succès', async () => {
      const taskId = 1;
      const taskData = { title: 'Tâche mise à jour' };
      const updatedTask = { id: taskId, title: 'Tâche mise à jour', status: 'in_progress' };
      (apiService.updateTask as jest.Mock).mockResolvedValue(updatedTask);
      const result = await taskUseCases.updateTask(taskId, taskData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedTask);
      expect(apiService.updateTask).toHaveBeenCalledWith(taskId, taskData);
      expect(toast.success).toHaveBeenCalledWith('Tâche mise à jour avec succès');
    });

    it('devrait gérer les erreurs lors de la mise à jour d\'une tâche', async () => {
      const errorMessage = 'Tâche non trouvée';
      (apiService.updateTask as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const result = await taskUseCases.updateTask(999, {});
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
  });

  describe('deleteTask', () => {
    it('devrait supprimer une tâche avec succès', async () => {
      const taskId = 1;
      (apiService.deleteTask as jest.Mock).mockResolvedValue(undefined);
      const result = await taskUseCases.deleteTask(taskId);
      expect(result.success).toBe(true);
      expect(apiService.deleteTask).toHaveBeenCalledWith(taskId);
      expect(toast.success).toHaveBeenCalledWith('Tâche supprimée avec succès');
    });

    it('devrait gérer les erreurs lors de la suppression d\'une tâche', async () => {
      const errorMessage = 'Erreur de serveur';
      (apiService.deleteTask as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const result = await taskUseCases.deleteTask(999);
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
  });

  describe('getUsers', () => {
    it('devrait récupérer les utilisateurs avec succès', async () => {
      const mockUsers = [
        { id: 1, name: 'Alice Dupont' },
        { id: 2, name: 'Jean Martin' }
      ];
      (apiService.getUsers as jest.Mock).mockResolvedValue(mockUsers);
      const result = await taskUseCases.getUsers();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUsers);
      expect(apiService.getUsers).toHaveBeenCalledTimes(1);
    });

    it('devrait gérer les erreurs lors de la récupération des utilisateurs', async () => {
      const errorMessage = 'Erreur de connexion';
      (apiService.getUsers as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const result = await taskUseCases.getUsers();
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
  });
});