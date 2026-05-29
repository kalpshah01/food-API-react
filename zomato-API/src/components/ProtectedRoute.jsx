import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const { isAuthenticated, token: reduxToken } = useSelector((state) => state.auth);

  
  const hasAuth = token || reduxToken || isAuthenticated;

  if (!hasAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
