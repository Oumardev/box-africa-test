/**
 * Configuration du thème ShadCN pour TaskMaster Pro
 *
 * ShadCN utilise Tailwind CSS, donc nous définissons principalement les variables CSS
 * qui seront utilisées dans Tailwind
 */

export const shadcnTheme = {
  // Couleurs principales
  primary: 'hsl(221.2 83.2% 53.3%)',
  primaryForeground: 'hsl(210 40% 98%)',

  // Couleurs secondaires
  secondary: 'hsl(12 76% 61%)',
  secondaryForeground: 'hsl(210 40% 98%)',

  // Couleurs de background
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(224 71.4% 4.1%)',

  // Couleurs pour les cartes
  card: 'hsl(0 0% 100%)',
  cardForeground: 'hsl(224 71.4% 4.1%)',

  // Couleurs de bordures et séparations
  border: 'hsl(220 13% 91%)',
  input: 'hsl(220 13% 91%)',

  // Couleurs sémantiques
  destructive: 'hsl(0 84.2% 60.2%)',
  destructiveForeground: 'hsl(210 40% 98%)',
  success: 'hsl(142.1 76.2% 36.3%)',
  successForeground: 'hsl(355.7 100% 97.3%)',
  warning: 'hsl(37 92% 50%)',
  warningForeground: 'hsl(355.7 100% 97.3%)',
  info: 'hsl(219 79% 66%)',
  infoForeground: 'hsl(210 40% 98%)',

  // Autres variables UI
  radius: '0.5rem',

  // Variables d'espacement
  padding: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
  },
};

// Création des styles CSS qui seront injectés quand le thème ShadCN est actif
export const createShadcnThemeStyles = () => `
  :root[data-theme="shadcn"] {
    --background: ${shadcnTheme.background};
    --foreground: ${shadcnTheme.foreground};

    --card: ${shadcnTheme.card};
    --card-foreground: ${shadcnTheme.cardForeground};

    --popover: ${shadcnTheme.card};
    --popover-foreground: ${shadcnTheme.cardForeground};

    --primary: ${shadcnTheme.primary};
    --primary-foreground: ${shadcnTheme.primaryForeground};

    --secondary: ${shadcnTheme.secondary};
    --secondary-foreground: ${shadcnTheme.secondaryForeground};

    --border: ${shadcnTheme.border};
    --input: ${shadcnTheme.input};

    --destructive: ${shadcnTheme.destructive};
    --destructive-foreground: ${shadcnTheme.destructiveForeground};
    
    --success: ${shadcnTheme.success};
    --success-foreground: ${shadcnTheme.successForeground};
    
    --warning: ${shadcnTheme.warning};
    --warning-foreground: ${shadcnTheme.warningForeground};
    
    --info: ${shadcnTheme.info};
    --info-foreground: ${shadcnTheme.infoForeground};

    --radius: ${shadcnTheme.radius};
  }
`;
