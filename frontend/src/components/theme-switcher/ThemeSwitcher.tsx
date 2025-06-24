import React from 'react';
import { useTheme, ThemeType } from '@/theme/ThemeContext';

// Composant pour Material UI
import { Switch, FormControlLabel, Box, Typography } from '@mui/material';

// Utilitaire pour les classes conditionnelles
import { cn } from '@/lib/utils/cn';

type ThemeSwitcherProps = {
  variant?: 'icon' | 'text';
  className?: string;
};

/**
 * Composant ThemeSwitcher qui permet de basculer entre Material UI et ShadCN
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  variant = 'text',
  className 
}) => {
  const { currentTheme, toggleTheme } = useTheme();

  // Rendu pour Material UI
  if (currentTheme === 'material') {
    return (
      <Box className={className}>
        <FormControlLabel
          control={
            <Switch
              checked={false}
              onChange={toggleTheme}
              name="themeSwitch"
              color="primary"
            />
          }
          label={
            variant === 'text' ? (
              <Typography variant="body2">
                Theme: <strong>Material UI</strong> / ShadCN
              </Typography>
            ) : (
              <Typography variant="body2">MUI</Typography>
            )
          }
        />
      </Box>
    );
  }

  // Rendu pour ShadCN
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={true}
          onChange={toggleTheme}
          className="sr-only"
        />
        <div className="relative w-10 h-5 bg-gray-200 rounded-full transition-colors dark:bg-gray-600">
          <div 
            className={cn(
              "absolute left-0 w-5 h-5 bg-white rounded-full transform transition-transform",
              "translate-x-5 border border-gray-300" 
            )}
          ></div>
        </div>
        {variant === 'text' ? (
          <span className="text-sm">
            Theme: Material UI / <strong>ShadCN</strong>
          </span>
        ) : (
          <span className="text-sm">ShadCN</span>
        )}
      </label>
    </div>
  );
};
