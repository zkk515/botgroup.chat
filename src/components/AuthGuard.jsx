import { Navigate, useLocation } from 'react-router-dom';

export default function AuthGuard({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  if (!token && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (token && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return children;
} 