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
  company_id?: string;
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

interface ITokenData {
  username: string,
  sub: string,
  iat: number,
  exp: number
}

interface IValidateToken {
  isValid: ITokenData | null;
}

interface IAuthContext {
  user?: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>,
  error: IAuthError;
  signIn: (data: IUserLoginRequest) => Promise<void>;
  logOff: () => void;
  validateToken: (token: string | null) => Promise<false | ITokenData | null | undefined>;
  findUserById: (id: string) => Promise<any>;
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

      // const { data: { access_token, ...userAuthenticaded } } = await api.get<IUserLoginResponse>('/auth');
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

  const validateToken = async (token: string | null) => {
    if (!token) return false;

    try {
      const { data: { isValid } } = await api.get<IValidateToken>(`/auth/validate-token?token=${token}`);

      if (isValid) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await findUserById(isValid.sub);
        
        setCookie('app.tascomeditor.token', token, {
          maxAge: 60 * 60 * 1, // 1 hora
          path: '/app',
        });
      };

      return isValid;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  const findUserById = async (id: string) => {
    try {
      const { data: userData } = await api.get(`/users/${id}`);
      
  
      setUserStoraged(JSON.stringify(userData));
  
      setUser(userData);

      return userData;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      error,
      signIn,
      logOff,
      validateToken,
      findUserById
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);