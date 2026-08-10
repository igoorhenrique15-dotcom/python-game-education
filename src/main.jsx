import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const STORAGE_KEY = 'pmga-progress-v3';

// Todas as fases ficam acessíveis desde o início, sem apagar o progresso já concluído.
try {
  const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...saved,
      unlocked: Number.MAX_SAFE_INTEGER,
      completed: saved.completed || {},
    })
  );
} catch {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ unlocked: Number.MAX_SAFE_INTEGER, completed: {} })
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
