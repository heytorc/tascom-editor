import React, { createContext, useContext, useState } from 'react';
import { SnackbarOrigin } from '@mui/material';

interface IFeedback extends SnackbarOrigin {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface IGlobalContext {
  feedback?: IFeedback;
  setFeedback: React.Dispatch<React.SetStateAction<IFeedback | undefined>>,
};

export const GlobalContext = createContext({} as IGlobalContext);

export const GlobalProvider: React.FC = ({ children }) => {
  const [feedback, setFeedback] = useState<IFeedback>();

  return (
    <GlobalContext.Provider
      value={{
        feedback,
        setFeedback
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => useContext(GlobalContext);