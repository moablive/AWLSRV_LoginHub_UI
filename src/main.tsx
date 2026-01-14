import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// 1. Bootstrap CSS (Deve vir antes) 
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Ícones (Para os botões de ação funcionarem) 
import 'bootstrap-icons/font/bootstrap-icons.css';

// 3. CSS Customizado (Sempre por último para sobrescrever o Bootstrap)
import './index.css' 

import { AppRoutes } from './routes/AppRoutes' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>,
)