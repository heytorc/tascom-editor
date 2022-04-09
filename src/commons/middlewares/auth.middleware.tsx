
import { useLocation, Navigate } from 'react-router-dom';
import { load as getCookie } from 'react-cookies';

import { useAuth } from "@/commons/contexts/auth.context";

export const AuthMiddleware = () => {
  const { user } = useAuth();
  const location = useLocation();
  const token = getCookie('app.token');

  if (!user || !token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <></>;
};