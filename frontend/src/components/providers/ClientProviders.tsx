"use client";

import { Toaster } from 'sonner';
import { ThemeProvider } from "@/theme/ThemeContext";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactQueryProvider } from '@/lib/providers/ReactQueryProvider';
import { FilterProvider } from '@/context/FilterContext';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <FilterProvider>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            {children}
            <Toaster position="top-right" richColors />
          </LocalizationProvider>
        </ThemeProvider>
      </FilterProvider>
    </ReactQueryProvider>
  );
}
