"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types de thèmes supportés
export type ThemeType = 'material' | 'shadcn';

// Interface du contexte de thème
interface ThemeContextType {
  currentTheme: ThemeType;
  isMaterial: boolean; // Propriété de convenance pour vérifier facilement le thème
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

// Création du contexte avec une valeur par défaut
const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'material',
  isMaterial: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Hook personnalisé pour utiliser le contexte de thème
export const useTheme = () => useContext(ThemeContext);

// Props pour le ThemeProvider
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
}

// Provider qui gère l'état du thème
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'material',
}) => {
  // État local pour stocker le thème actuel
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(defaultTheme);

  // Effet pour charger le thème depuis localStorage au montage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme && (savedTheme === 'material' || savedTheme === 'shadcn')) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Effet pour sauvegarder le thème dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    // Ajouter un attribut 'data-theme' au HTML pour pouvoir cibler avec CSS
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Fonction pour basculer entre les thèmes
  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'material' ? 'shadcn' : 'material'));
  };

  // Fonction pour définir directement un thème
  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  // Valeur fournie par le contexte
  const value = {
    currentTheme,
    isMaterial: currentTheme === 'material',
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
