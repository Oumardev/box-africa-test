import React from 'react';
import { useTheme } from '@/theme/ThemeContext';
import { TaskFormValues } from '@/lib/validation/task-schema';
import TaskFormContent from './TaskFormContent';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import { toast } from 'sonner';

// Material UI Components
import { Dialog as MuiDialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// ShadCN Components
import {
  Dialog,
  DialogContent as ShadcnDialogContent,
  DialogHeader,
  DialogTitle as ShadcnDialogTitle,
} from '@/components/ui/shadcn/dialog';
import { X } from 'lucide-react';

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback appelé après la mise à jour réussie
}

/**
 * Dialog pour l'édition d'une tâche existante qui s'adapte au thème actif
 */
export const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  task,
  open,
  onClose,
  onSuccess,
}) => {
  const { currentTheme } = useTheme();
  const { updateTask } = useTasks();

  const defaultValues: TaskFormValues = {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate || null,
    assigneeId: task.assigneeId,
    tags: task.tags,
  };

  const handleSubmit = async (data: TaskFormValues) => {
    const { dueDate, ...restData } = data;

    try {
      await updateTask.mutateAsync({
        id: Number(task.id),
        data: {
          ...restData,
          dueDate: dueDate === null ? undefined : dueDate,
        },
      });

      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(
        `Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      );
    }
  };

  // Rendu pour Material UI
  if (currentTheme === 'material') {
    return (
      <MuiDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Modifier la tâche
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TaskFormContent
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isEditMode={true}
          />
        </DialogContent>
      </MuiDialog>
    );
  }

  // Rendu pour ShadCN
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <ShadcnDialogContent className="sm:max-w-[600px]">
        <DialogHeader className="relative">
          <ShadcnDialogTitle>Modifier la tâche</ShadcnDialogTitle>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </button>
        </DialogHeader>
        <TaskFormContent
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isEditMode={true}
        />
      </ShadcnDialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
