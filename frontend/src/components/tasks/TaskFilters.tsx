import React, { useMemo } from 'react';
import { useTheme } from '@/theme/ThemeContext';
import { useFilter } from '@/context/FilterContext';
import { useUsers } from '@/hooks/useUsers';
import { taskPriorityOptions, taskStatusOptions } from '@/lib/validation/task-schema';
import { TaskStatus, TaskPriority } from '@/types/task';

// Material UI Components
import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

// ShadCN Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Input } from '@/components/ui/shadcn/input';
import { Button } from '@/components/ui/shadcn/button';
import { Label } from '@/components/ui/shadcn/label';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/shadcn/badge';

/**
 * Composant de filtres avancés pour les tâches qui s'adapte au thème actif
 */
export const TaskFilters: React.FC = () => {
  const { currentTheme } = useTheme();
  const { useUsersList } = useUsers();
  const { data: users = [] } = useUsersList();

  // Utiliser le contexte de filtre global
  const { filter, setFilter: updateFilter, resetFilters } = useFilter();

  // Calcul des filtres actifs avec useMemo pour éviter les calculs inutiles
  const activeFiltersCount = useMemo(() => {
    return Object.values(filter).filter(
      (value) => value !== null && value !== undefined && value !== '',
    ).length;
  }, [filter]);

  // Rendu pour Material UI
  if (currentTheme === 'material') {
    return (
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">
              Filtres
            </Typography>
          </Box>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} ${activeFiltersCount > 1 ? 'filtres actifs' : 'filtre actif'}`}
              color="primary"
              size="small"
              onDelete={resetFilters}
              deleteIcon={<ClearIcon />}
            />
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Rechercher"
              size="small"
              value={filter.search || ''}
              onChange={(e) => updateFilter({ search: e.target.value })}
              placeholder="Titre ou description"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={String(filter.status || '')}
                onChange={(e) =>
                  updateFilter({
                    status: e.target.value === '' ? null : (e.target.value as TaskStatus),
                  })
                }
                label="Statut"
                displayEmpty
              >
                <MenuItem value="">Tous les statuts</MenuItem>
                {taskStatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Priorité</InputLabel>
              <Select
                value={String(filter.priority || '')}
                onChange={(e) =>
                  updateFilter({
                    priority: e.target.value === '' ? null : (e.target.value as TaskPriority),
                  })
                }
                label="Priorité"
                displayEmpty
              >
                <MenuItem value="">Toutes les priorités</MenuItem>
                {taskPriorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Assigné à</InputLabel>
              <Select
                value={String(filter.assigneeId || '')}
                onChange={(e) =>
                  updateFilter({ assigneeId: e.target.value === '' ? null : e.target.value })
                }
                label="Assigné à"
                displayEmpty
              >
                <MenuItem value="">Tous les assignés</MenuItem>
                <MenuItem value="unassigned">Non assigné</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {activeFiltersCount > 0 && (
            <Grid size={{ xs: 12 }} sx={{ display: { xs: 'block', sm: 'none' }, mt: 1 }}>
              <IconButton
                onClick={resetFilters}
                size="small"
                color="primary"
                sx={{ ml: 'auto', display: 'flex' }}
              >
                <ClearIcon fontSize="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  Réinitialiser les filtres
                </Typography>
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Paper>
    );
  }

  // Rendu pour ShadCN
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            <CardTitle>Filtres</CardTitle>
          </div>

          {activeFiltersCount > 0 && (
            <Badge className="flex items-center gap-1 cursor-pointer" onClick={resetFilters}>
              {activeFiltersCount} {activeFiltersCount > 1 ? 'filtres actifs' : 'filtre actif'}
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              placeholder="Titre ou description"
              value={filter.search || ''}
              onChange={(e) => updateFilter({ search: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <ShadcnSelect
              value={String(filter.status || '')}
              onValueChange={(value) =>
                updateFilter({ status: value === 'all_status' ? null : (value as TaskStatus) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_status">Tous les statuts</SelectItem>
                {taskStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </ShadcnSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <ShadcnSelect
              value={String(filter.priority || '')}
              onValueChange={(value) =>
                updateFilter({
                  priority: value === 'all_priority' ? null : (value as TaskPriority),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les priorités" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_priority">Toutes les priorités</SelectItem>
                {taskPriorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </ShadcnSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assigné à</Label>
            <ShadcnSelect
              value={String(filter.assigneeId || '')}
              onValueChange={(value) =>
                updateFilter({ assigneeId: value === 'all_assignees' ? null : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les assignés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_assignees">Tous les assignés</SelectItem>
                <SelectItem value="unassigned">Non assigné</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </ShadcnSelect>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="mt-4 flex justify-end sm:hidden">
            <Button variant="ghost" size="sm" onClick={resetFilters} className="flex items-center">
              <X className="mr-1 h-4 w-4" />
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskFilters;
