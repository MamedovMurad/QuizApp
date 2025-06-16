// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const isAuthenticated = !!localStorage.getItem('agent'); // or 'auth', 'user', etc.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
