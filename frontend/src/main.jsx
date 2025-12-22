import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { OrderProvider } from './contexts/orderContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OrderProvider>
        <App />
      </OrderProvider>
    
  </StrictMode>,
)
