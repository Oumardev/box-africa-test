import React, { useState } from 'react';
import { useTheme } from '@/theme/ThemeContext';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import EditTaskDialog from './EditTaskDialog';
import DeleteTaskDialog from './DeleteTaskDialog';
import TaskAssigneeSelector from './TaskAssigneeSelector';
import { useUsers } from '@/hooks/useUsers';

// Material UI Components
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardActions as MuiCardActions,
  Typography,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// ShadCN Components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Badge } from '@/components/ui/shadcn/badge';
import { CalendarIcon, Edit, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (id: string, newStatus: string) => void;
  onDelete?: (id: string) => void;
}

// Fonction déplacée à l'intérieur du composant pour avoir accès au hook useUsers

// Map des couleurs pour les priorités
const priorityColorMap: Record<string, string> = {
  low: 'success',
  medium: 'info',
  high: 'warning',
  urgent: 'error',
};

// Map des classes tailwind pour les priorités dans ShadCN
const priorityClassMap: Record<string, string> = {
  low: 'bg-green-500',
  medium: 'bg-blue-500',
  high: 'bg-amber-500',
  urgent: 'bg-red-500',
};

// Map des labels pour les priorités
const priorityLabelMap: Record<string, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente',
};

// Map des labels pour les statuts
const statusLabelMap: Record<string, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  review: 'En revue',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

/**
 * Composant d'affichage d'une carte de tâche qui s'adapte au thème actif
 */
export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { currentTheme } = useTheme();
  const { useUsersList, findUserById } = useUsers();
  const { data: users = [] } = useUsersList();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fonction utilitaire pour obtenir le nom de l'assigné
  const getAssigneeName = (assigneeId?: string): string => {
    if (!assigneeId) return 'Non assigné';
    const user = findUserById(users, assigneeId);
    return user ? user.name : 'Inconnu';
  };

  // Rendu pour Material UI
  if (currentTheme === 'material') {
    return (
      <>
        <MuiCard sx={{ mb: 2 }}>
          <MuiCardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" component="div">
                {task.title}
              </Typography>
              <Box>
                <Chip
                  label={priorityLabelMap[task.priority]}
                  color={
                    priorityColorMap[task.priority] as 'success' | 'info' | 'warning' | 'error'
                  }
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip label={statusLabelMap[task.status]} variant="outlined" size="small" />
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {task.description}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TaskAssigneeSelector taskId={task.id} currentAssigneeId={task.assigneeId} />
                <Typography variant="body2" color="text.secondary">
                  {getAssigneeName(task.assigneeId)}
                </Typography>
              </Box>
              {task.dueDate && (
                <Typography variant="caption">
                  Échéance: {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: fr })}
                </Typography>
              )}
            </Box>
          </MuiCardContent>

          <MuiCardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
            <IconButton size="small" color="primary" onClick={() => setIsEditDialogOpen(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => setIsDeleteDialogOpen(true)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </MuiCardActions>
        </MuiCard>

        {isEditDialogOpen && (
          <EditTaskDialog
            task={task}
            open={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
          />
        )}

        {isDeleteDialogOpen && (
          <DeleteTaskDialog
            task={task}
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
          />
        )}
      </>
    );
  }

  // Rendu pour ShadCN
  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>{task.title}</CardTitle>
            <div className="flex gap-2">
              <Badge className={priorityClassMap[task.priority]}>
                {priorityLabelMap[task.priority]}
              </Badge>
              <Badge variant="outline">{statusLabelMap[task.status]}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground mb-4">{task.description}</p>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TaskAssigneeSelector taskId={task.id} currentAssigneeId={task.assigneeId} />
              <span className="text-xs text-muted-foreground">
                {getAssigneeName(task.assigneeId)}
              </span>
            </div>

            {task.dueDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: fr })}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-1" /> Modifier
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Supprimer
          </Button>
        </CardFooter>
      </Card>

      {isEditDialogOpen && (
        <EditTaskDialog
          task={task}
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteTaskDialog
          task={task}
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </>
  );
};

export default TaskCard;
