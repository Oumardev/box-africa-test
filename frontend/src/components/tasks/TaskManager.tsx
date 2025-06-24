import React, { useState } from 'react';
import { useTheme } from '@/theme/ThemeContext';
import { Task } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';

// Composants de tâches
import TaskFilters from './TaskFilters';
import TaskCard from './TaskCard';
import AddTaskDialog from './AddTaskDialog';

// Material UI Components
import {
  Container,
  Typography,
  Button as MuiButton,
  Box,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// ShadCN Components
import { Button } from '@/components/ui/shadcn/button';
import { Plus } from 'lucide-react';

export const TaskManager: React.FC = () => {
  const { isMaterial } = useTheme();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Utiliser le hook pour les opérations CRUD sur les tâches
  const {
    data: filteredTasks = [],
    isLoading,
    error: queryError,
    updateTask,
    deleteTask,
    refetch: refetchTasks,
  } = useTasks();

  // Formater l'erreur
  const error = queryError ? (queryError as Error).message : '';

  // Gestionnaire pour ouvrir le dialogue d'ajout
  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  // Gestionnaire pour la mise à jour du statut d'une tâche
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateTask.mutateAsync({
        id: Number(id),
        data: { status: status as Task['status'] },
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Gestionnaire pour la suppression d'une tâche
  const handleTaskDelete = async (id: string) => {
    try {
      await deleteTask.mutateAsync(Number(id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Affichage de l'état de chargement
  const renderLoadingState = () => {
    if (isMaterial) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  };

  // Affichage des erreurs
  const renderErrorState = () => {
    if (isMaterial) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error || "Une erreur s'est produite lors du chargement des tâches."}
        </Alert>
      );
    }

    return (
      <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md my-4">
        {error || "Une erreur s'est produite lors du chargement des tâches."}
      </div>
    );
  };

  // Affichage quand aucune tâche ne correspond aux filtres
  const renderEmptyFilteredState = () => {
    if (isMaterial) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center', my: 3 }}>
          <Typography color="textSecondary">
            Aucune tâche ne correspond aux filtres sélectionnés.
          </Typography>
        </Paper>
      );
    }

    return (
      <div className="bg-muted/50 p-8 text-center rounded-md my-6">
        <p className="text-muted-foreground">
          Aucune tâche ne correspond aux filtres sélectionnés.
        </p>
      </div>
    );
  };

  // Affichage quand il n'y a aucune tâche
  const renderEmptyTasksState = () => {
    if (isMaterial) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center', my: 3 }}>
          <Typography color="textSecondary" paragraph>
            Vous n'avez pas encore ajouté de tâches.
          </Typography>
          <MuiButton variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
            Ajouter une tâche
          </MuiButton>
        </Paper>
      );
    }

    return (
      <div className="bg-muted/50 p-8 text-center rounded-md my-6">
        <p className="text-muted-foreground mb-4">Vous n'avez pas encore ajouté de tâches.</p>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une tâche
        </Button>
      </div>
    );
  };

  // Rendu principal pour Material UI
  if (isMaterial) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Gestion des tâches
          </Typography>

          <MuiButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Nouvelle tâche
          </MuiButton>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <TaskFilters />

        {isLoading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : filteredTasks.length === 0 ? (
          renderEmptyTasksState()
        ) : filteredTasks.length === 0 ? (
          renderEmptyFilteredState()
        ) : (
          <Grid container spacing={2}>
            {filteredTasks.map((task: Task) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
                <TaskCard
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleTaskDelete}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <AddTaskDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={() => refetchTasks()}
        />
      </Container>
    );
  }

  // Rendu principal pour ShadCN
  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des tâches</h1>

        <Button onClick={handleOpenAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle tâche
        </Button>
      </div>

      <div className="border-b mb-6" />

      <TaskFilters />

      {isLoading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : filteredTasks.length === 0 ? (
        renderEmptyTasksState()
      ) : filteredTasks.length === 0 ? (
        renderEmptyFilteredState()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task: Task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleTaskDelete}
            />
          ))}
        </div>
      )}

      <AddTaskDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() => refetchTasks()}
      />
    </div>
  );
};

export default TaskManager;
