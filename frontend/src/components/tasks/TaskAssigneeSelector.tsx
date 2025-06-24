import React from 'react';
import { useTheme } from '@/theme/ThemeContext';
import { useTasks } from '@/hooks/useTasks';
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'sonner';

// Material UI Components
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';

// ShadCN Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import { Button } from '@/components/ui/shadcn/button';
import { UserX } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface TaskAssigneeSelectorProps {
  taskId: string;
  currentAssigneeId?: string;
  className?: string;
}

/**
 * Composant permettant de changer rapidement l'assignation d'une tâche
 * S'adapte au thème actif (Material UI ou ShadCN)
 */
export const TaskAssigneeSelector: React.FC<TaskAssigneeSelectorProps> = ({
  taskId,
  currentAssigneeId,
  className,
}) => {
  const { currentTheme } = useTheme();
  const { updateTask } = useTasks();
  const { useUsersList, findUserById } = useUsers();
  const { data: users = [] } = useUsersList();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Trouver l'utilisateur actuellement assigné
  const assignee = currentAssigneeId ? findUserById(users, currentAssigneeId) : undefined;

  // Obtenir les initiales de l'utilisateur assigné
  const getAssigneeInitials = (): string => {
    if (!assignee) return '';

    const nameParts = assignee.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return assignee.name.substring(0, 2).toUpperCase();
  };

  // Handler pour ouvrir le menu (Material UI)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handler pour fermer le menu (Material UI)
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handler pour assigner une tâche à un utilisateur
  const handleAssign = async (userId: string | null) => {
    try {
      // Convertir null en undefined pour compatibilité de type
      const assigneeId = userId === null ? undefined : userId;

      // Mise à jour via React Query
      await updateTask.mutateAsync({
        id: Number(taskId),
        data: { assigneeId },
      });

      if (userId) {
        const user = findUserById(users, userId);
        toast.success(`Tâche assignée à ${user?.name || 'un utilisateur'}`);
      } else {
        toast.success('Tâche désassignée');
      }
    } catch (error) {
      toast.error(
        `Erreur lors de l'assignation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      );
    }

    handleClose();
  };

  // Rendu pour Material UI
  if (currentTheme === 'material') {
    return (
      <>
        <Tooltip title={assignee ? `Assigné à: ${assignee.name}` : 'Non assigné'}>
          <IconButton
            aria-controls={Boolean(anchorEl) ? 'assign-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            onClick={handleClick}
            size="small"
          >
            {assignee ? (
              <Avatar sx={{ width: 30, height: 30, fontSize: '0.75rem' }}>
                {getAssigneeInitials()}
              </Avatar>
            ) : (
              <PersonOffIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <Menu id="assign-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
            Assigner à
          </Typography>
          <Divider />
          <MenuItem key="unassign" onClick={() => handleAssign(null)}>
            <ListItemIcon>
              <PersonOffIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Désassigner</ListItemText>
          </MenuItem>
          <Divider />
          {users.map((user) => (
            <MenuItem key={user.id} onClick={() => handleAssign(user.id.toString())}>
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24 }}>{user.name.substring(0, 2)}</Avatar>
              </ListItemIcon>
              <ListItemText>{user.name}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  // Rendu pour ShadCN
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn('h-8 w-8 p-0', className)}>
          {assignee ? (
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">
              {getAssigneeInitials()}
            </div>
          ) : (
            <UserX className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">Changer l'assignation</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Assigner à</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleAssign(null)}>
            <UserX className="mr-2 h-4 w-4" />
            <span>Désassigner</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {users.map((user) => (
            <DropdownMenuItem key={user.id} onClick={() => handleAssign(user.id.toString())}>
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs mr-2">
                  {user.name.substring(0, 2)}
                </div>
                <span>{user.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskAssigneeSelector;
