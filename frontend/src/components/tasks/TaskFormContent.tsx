import React from 'react';
import { useForm, Resolver, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@/theme/ThemeContext';
import { useUsers } from '@/hooks/useUsers';

// Material UI Components
import {
  TextField,
  Button as MuiButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// ShadCN Components
import {
  Form,
  FormControl as ShadcnFormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form';
import { Input } from '@/components/ui/shadcn/input';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/shadcn/select';
import { Textarea } from '@/components/ui/shadcn/textarea';
import { Button as ShadcnButton } from '@/components/ui/shadcn/button';
import { format } from 'date-fns';

// Validation and Types
import {
  TaskFormValues,
  taskSchema,
  taskPriorityOptions,
  taskStatusOptions,
} from '@/lib/validation/task-schema';

interface TaskFormContentProps {
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (data: TaskFormValues) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

/**
 * Contenu du formulaire de tâche qui s'adapte au thème actif (Material UI ou ShadCN)
 */
export const TaskFormContent: React.FC<TaskFormContentProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isEditMode = false,
}) => {
  const { currentTheme } = useTheme();
  const { useUsersList } = useUsers();
  const { data: users = [] } = useUsersList();

  // Valeurs par défaut pour un nouveau formulaire
  const emptyDefaultValues: TaskFormValues = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: null,
    assigneeId: undefined,
    tags: [],
  };

  // Normaliser les valeurs par défaut pour éviter les erreurs de type
  const normalizeDefaultValues = (
    values: Partial<TaskFormValues> = {},
  ): Partial<TaskFormValues> => {
    const normalized = { ...values };

    // Convertir assigneeId en string si c'est un nombre
    if (normalized.assigneeId !== undefined && normalized.assigneeId !== null) {
      normalized.assigneeId = String(normalized.assigneeId);
    }

    // Convertir dueDate en objet Date si c'est une chaîne
    if (normalized.dueDate && typeof normalized.dueDate === 'string') {
      normalized.dueDate = new Date(normalized.dueDate);
    }

    return normalized;
  };

  // Using explicit type for the resolver to match React Hook Form's expectations
  const resolver = zodResolver(taskSchema) as unknown as Resolver<TaskFormValues>;

  const form = useForm<TaskFormValues>({
    resolver,
    defaultValues: normalizeDefaultValues(defaultValues) || emptyDefaultValues,
  });

  // Gestion de la soumission du formulaire
  const handleSubmit: SubmitHandler<TaskFormValues> = (data) => {
    // Normaliser les données avant la soumission pour éviter les erreurs de type
    const normalizedData = {
      ...data,
      assigneeId: data.assigneeId ? String(data.assigneeId) : undefined,
      dueDate: data.dueDate
        ? typeof data.dueDate === 'string'
          ? new Date(data.dueDate)
          : data.dueDate
        : undefined,
    };

    onSubmit(normalizedData);
  };

  // Rendu pour Material UI
  if (currentTheme === 'material') {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box component="form" onSubmit={form.handleSubmit(handleSubmit)} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Titre"
                {...form.register('title')}
                error={!!form.formState.errors.title}
                helperText={form.formState.errors.title?.message}
              />
            </Grid>
            <Grid size={12} component="div">
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                {...form.register('description')}
                error={!!form.formState.errors.description}
                helperText={form.formState.errors.description?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} component="div">
              <FormControl fullWidth error={!!form.formState.errors.status}>
                <InputLabel>Statut</InputLabel>
                <Select
                  label="Statut"
                  {...form.register('status')}
                  defaultValue={form.getValues('status')}
                >
                  {taskStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {form.formState.errors.status && (
                  <FormHelperText>{form.formState.errors.status.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} component="div">
              <FormControl fullWidth error={!!form.formState.errors.priority}>
                <InputLabel>Priorité</InputLabel>
                <Select
                  label="Priorité"
                  {...form.register('priority')}
                  defaultValue={form.getValues('priority')}
                >
                  {taskPriorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {form.formState.errors.priority && (
                  <FormHelperText>{form.formState.errors.priority.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} component="div">
              <DatePicker
                label="Date d'échéance"
                value={form.getValues('dueDate')}
                onChange={(date) => form.setValue('dueDate', date as Date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!form.formState.errors.dueDate,
                    helperText: form.formState.errors.dueDate?.message,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} component="div">
              <FormControl fullWidth>
                <InputLabel>Assigné à</InputLabel>
                <Select
                  label="Assigné à"
                  {...form.register('assigneeId')}
                  defaultValue={form.getValues('assigneeId') || ''}
                >
                  <MenuItem value="">Non assigné</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
              component="div"
              sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}
            >
              {onCancel && (
                <MuiButton variant="outlined" color="secondary" onClick={onCancel}>
                  Annuler
                </MuiButton>
              )}
              <MuiButton type="submit" variant="contained" color="primary">
                {isEditMode ? 'Enregistrer' : 'Ajouter'}
              </MuiButton>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    );
  }

  // Rendu pour ShadCN
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <ShadcnFormControl>
                <Input placeholder="Titre de la tâche" {...field} />
              </ShadcnFormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <ShadcnFormControl>
                <Textarea
                  placeholder="Description détaillée de la tâche"
                  className="min-h-[120px]"
                  {...field}
                />
              </ShadcnFormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => {
              // S'assurer qu'une valeur par défaut est toujours définie
              if (!field.value) field.value = 'todo';

              return (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <ShadcnSelect onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-w-[240px]">
                      {taskStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ShadcnSelect>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priorité</FormLabel>
                <ShadcnSelect onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une priorité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {taskPriorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </ShadcnSelect>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assigneeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigné à</FormLabel>
                <ShadcnSelect
                  onValueChange={field.onChange}
                  value={field.value ? field.value.toString() : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un assigné" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectGroup>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </ShadcnSelect>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => {
              // S'assurer que la date est un objet Date et non une chaîne
              const dateValue = field.value
                ? typeof field.value === 'string'
                  ? new Date(field.value)
                  : field.value
                : null;

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Date d'échéance</FormLabel>
                  <ShadcnFormControl>
                    <Input
                      type="date"
                      value={dateValue ? format(dateValue, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        field.onChange(date);
                      }}
                    />
                  </ShadcnFormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <ShadcnButton type="button" variant="outline" onClick={onCancel}>
              Annuler
            </ShadcnButton>
          )}
          <ShadcnButton type="submit">{isEditMode ? 'Modifier' : 'Ajouter'}</ShadcnButton>
        </div>
      </form>
    </Form>
  );
};

export default TaskFormContent;
