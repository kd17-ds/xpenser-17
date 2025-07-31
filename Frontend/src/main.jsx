import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css'
import { LoadingProvider } from "./contexts/LoadingContext";
import AuthProvider from './contexts/AuthContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LoadingProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LoadingProvider>
  </BrowserRouter>,
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch((err) => console.error('Service Worker registration failed:', err));
}
