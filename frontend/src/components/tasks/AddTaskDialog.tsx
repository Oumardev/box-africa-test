import React from 'react';
import { useTheme } from '@/theme/ThemeContext';
import { TaskFormValues } from '@/lib/validation/task-schema';
import TaskFormContent from './TaskFormContent';
import { useTaskStore } from '@/store/useTaskStore';
import { useTasks } from '@/hooks/useTasks';
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

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onClose, onSuccess }) => {
  const { currentTheme } = useTheme();
  const addTask = useTaskStore((state) => state.addTask);
  const { createTask } = useTasks();

  const handleSubmit = async (data: TaskFormValues) => {
    const { dueDate, ...restData } = data;

    try {
      await createTask.mutateAsync({
        ...restData,
        dueDate: dueDate === null ? undefined : dueDate,
        assigneeId: data.assigneeId || undefined,
        tags: data.tags || [],
        creatorId: 'user1', // ID utilisateur fictif (dans un cas réel, ce serait l'utilisateur connecté)
      });

      addTask({
        ...restData,
        dueDate: dueDate === null ? undefined : dueDate,
        assigneeId: data.assigneeId || undefined,
        tags: data.tags || [],
        creatorId: 'user1',
        comments: [],
        attachments: [],
      });

      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(
        `Erreur lors de l'ajout de la tâche: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      );
    }
  };

  // Rendu pour Material UI
  if (currentTheme === 'material') {
    return (
      <MuiDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Ajouter une nouvelle tâche
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
          <TaskFormContent onSubmit={handleSubmit} onCancel={onClose} />
        </DialogContent>
      </MuiDialog>
    );
  }

  // Rendu pour ShadCN
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <ShadcnDialogContent className="sm:max-w-[600px]">
        <DialogHeader className="relative">
          <ShadcnDialogTitle>Ajouter une nouvelle tâche</ShadcnDialogTitle>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </button>
        </DialogHeader>
        <TaskFormContent onSubmit={handleSubmit} onCancel={onClose} />
      </ShadcnDialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
