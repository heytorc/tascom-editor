
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export const AuthMiddleware = () => {
  const location = useLocation();
  const [{ 'app.tascomeditor.token': token }] = useCookies(['app.tascomeditor.token']);

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};