// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthProvider';
import { Spin } from 'antd';

export default function PrivateRoute({ role }: { role?: string }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const handleRedirect = () => {
    localStorage.removeItem('agent');
    localStorage.removeItem('name');
    return <Navigate to="/login" replace />;
  };

  if (role === "admin") {
    return user?.role === "admin" ? <Outlet /> : handleRedirect();
  }

  return localStorage.getItem("agent")? <Outlet /> : handleRedirect();
}
