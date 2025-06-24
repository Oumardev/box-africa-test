import React, { createContext, useState, useContext, ReactNode } from 'react';
import { TaskFilter } from '@/types/task';

// Définir le type pour le contexte
type FilterContextType = {
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  resetFilters: () => void;
};

// Créer le contexte
export const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider component
export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filter, setFilter] = useState<TaskFilter>({
    status: null,
    priority: null,
    assigneeId: null,
    search: '',
  });

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilter({
      status: null,
      priority: null,
      assigneeId: null,
      search: '',
    });
  };

  return (
    <FilterContext.Provider value={{ filter, setFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter doit être utilisé à l'intérieur d'un FilterProvider");
  }
  return context;
};
