import React, { createContext, useState, FC, useContext } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import api from "@/commons/services/api";

import IUserLoginResponse from '@/commons/interfaces/user/IUserLoginResponse';
import useLocalStorage from "@/commons/hooks/useLocalStorage";

interface IUser {
  _id?: string;
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  company?: string;
  system_id?: string;
  token?: string;
  active?: boolean;
  type?: "USER" | "ADMIN";
}

interface IUserLoginRequest {
  username: string;
  password: string;
}

interface IAuthError {
  message: string | null;
}

interface IAuthContext {
  user?: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>,
  error: IAuthError;
  signIn: (data: IUserLoginRequest) => Promise<void>;
  logOff: () => void;
}

export const AuthContext = createContext({} as IAuthContext);

export const AuthProvider: FC = ({ children }) => {
  const navigate = useNavigate();

  const [userStoraged, setUserStoraged] = useLocalStorage<string>("user", "");

  const userLogged: IUser | undefined = userStoraged.length > 0 ? JSON.parse(userStoraged) : undefined;

  const [cookie, setCookie, removeCookie] = useCookies(['app.tascomeditor.token', 'app.tascomeditor.user'])

  const [user, setUser] = useState<IUser | undefined>(userLogged);
  const [error, setError] = useState({ message: null });

  const signIn = async (userData: IUserLoginRequest) => {
    try {
      setError({ message: null });

      // const { data: userAuthenticaded } = await api.post<IUserLoginResponse>('/user/auth', userData);
      const { data: { access_token, ...userAuthenticaded } } = await api.post<IUserLoginResponse>(`/auth/login`, userData);
  
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
      setCookie('app.tascomeditor.token', access_token, {
        maxAge: 60 * 60 * 1, // 1 hora
        path: '/app',
      });

      setUserStoraged(JSON.stringify(userAuthenticaded));
  
      setUser(userAuthenticaded);

      const lastPage = localStorage.getItem('currentPage') || '/app';
  
      navigate(lastPage);
    } catch (error: any) {
      const { response: { data: { message = null } } } = error;
      setError({ message });
    }
  };

  const logOff = () => {
    removeCookie('app.tascomeditor.token');
    setUserStoraged("");
    localStorage.removeItem('currentPage');

    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      error,
      signIn,
      logOff
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);