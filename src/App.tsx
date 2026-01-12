import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SuperAdmin from './pages/SuperAdmin';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './router/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rota Pública (Login) */}
        <Route path="/" element={<Login />} />

        {/* Rotas Protegidas (Exige JWT) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Rota Super Admin (Secreta / Desenvolvimento) */}
        {/* Nota: Em produção, você pode querer proteger isso extra, mas a Master Key segura o back */}
        <Route path="/super-admin" element={<SuperAdmin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;