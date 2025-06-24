import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

/**
 * Props du bouton Material UI étendues
 */
export interface ButtonProps extends MuiButtonProps {
  // Propriétés personnalisées supplémentaires
  fullWidth?: boolean;
}

/**
 * Composant Button avec le style Material UI
 */
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'contained', 
  color = 'primary', 
  fullWidth = false,
  size = 'medium',
  ...props 
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      size={size}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
