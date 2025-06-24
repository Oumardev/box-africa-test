import React from 'react';
import { useTheme } from '@/theme/ThemeContext';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import { toast } from 'sonner';

// Material UI Components
import { 
  Dialog as MuiDialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText,
  DialogActions,
  Button as MuiButton,
  IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// ShadCN Components
import { 
  Dialog, 
  DialogContent as ShadcnDialogContent, 
  DialogHeader, 
  DialogTitle as ShadcnDialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/shadcn/dialog';
import { Button as ShadcnButton } from '@/components/ui/shadcn/button';
import { X } from 'lucide-react';

interface DeleteTaskDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback facultatif appelé après la suppression réussie
}


export const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({ 
  task, 
  open, 
  onClose,
  onSuccess 
}) => {
  const { currentTheme } = useTheme();
  const { deleteTask } = useTasks();
  
  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(Number(task.id));
      
      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };
  
  // Rendu pour Material UI
  if (currentTheme === 'material') {
    return (
      <MuiDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Confirmer la suppression
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
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer la tâche <strong>"{task.title}"</strong> ?<br />
            Cette action est irréversible et toutes les données associées seront perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <MuiButton onClick={onClose} variant="outlined" color="primary">
            Annuler
          </MuiButton>
          <MuiButton 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            autoFocus
          >
            Supprimer
          </MuiButton>
        </DialogActions>
      </MuiDialog>
    );
  }
  
  // Rendu pour ShadCN
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <ShadcnDialogContent className="sm:max-w-[500px]">
        <DialogHeader className="relative">
          <ShadcnDialogTitle>Confirmer la suppression</ShadcnDialogTitle>
          <button 
            onClick={onClose}
            className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </button>
        </DialogHeader>
        
        <DialogDescription className="py-4">
          Êtes-vous sûr de vouloir supprimer la tâche <span className="font-semibold">"{task.title}"</span> ?<br />
          Cette action est irréversible et toutes les données associées seront perdues.
        </DialogDescription>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <ShadcnButton 
            variant="outline" 
            onClick={onClose}
          >
            Annuler
          </ShadcnButton>
          <ShadcnButton 
            variant="destructive" 
            onClick={handleDelete}
          >
            Supprimer
          </ShadcnButton>
        </DialogFooter>
      </ShadcnDialogContent>
    </Dialog>
  );
};

export default DeleteTaskDialog;
