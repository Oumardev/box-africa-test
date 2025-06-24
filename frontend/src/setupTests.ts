// Fichier de configuration pour Jest
import '@testing-library/jest-dom';

// Configuration globale pour les tests
beforeAll(() => {
  // Configuration globale avant tous les tests
  console.log('Tests started');
});

afterAll(() => {
  // Nettoyage après tous les tests
  console.log('Tests finished');
});
