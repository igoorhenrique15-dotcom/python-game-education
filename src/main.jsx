import React from 'react';
import { createRoot } from 'react-dom/client';
import CompleteApp from './CompleteApp.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CompleteApp />
  </React.StrictMode>
);
