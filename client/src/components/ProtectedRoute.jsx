import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * ProtectedRoute: Wraps routes that require authentication.
 * Unauthenticated users are redirected to /login.
 * Renders child routes via <Outlet /> if authenticated.
 */
const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
