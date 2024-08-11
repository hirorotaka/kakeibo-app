import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppcontextProvider } from './context/AppContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppcontextProvider>
      <App />
    </AppcontextProvider>
  </StrictMode>
);
