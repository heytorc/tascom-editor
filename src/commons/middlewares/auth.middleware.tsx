
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { useAuth } from "@/commons/contexts/auth.context";

export const AuthMiddleware = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [{ 'app.tascomeditor.token': token }] = useCookies(['app.tascomeditor.token']);
  
  localStorage.setItem('currentPage', location.pathname);
  
  if (!user?._id && !token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};