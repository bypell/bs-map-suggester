import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';

import 'flag-icons/css/flag-icons.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
