import React, { useEffect } from 'react';
import { Alert, Snackbar, SnackbarOrigin, Grow } from '@mui/material';
import { useGlobal } from '@/commons/contexts/global.context';
// import { Container } from './styles';

export interface ISnackbarState extends SnackbarOrigin {
  open: boolean;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

const SnackbarComponent: React.FC = () => {
  const { feedback } = useGlobal();

  const [state, setState] = React.useState<ISnackbarState>({
    open: !!feedback,
    vertical: "bottom",
    horizontal: "left",
    type: "error",
    message: ""
  });

  const { open, vertical, horizontal, message } = state;

  useEffect(() => {
    handleFeedback();
  }, [feedback]);

  const handleFeedback = () => {
    if (feedback) {
      const { type, message } = feedback;

      setState(prevState => ({
        ...prevState,
        open: true,
        type,
        message
      }));

      setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          open: false,
        }));
      }, 6000);
    }
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      anchorOrigin={{ vertical, horizontal }}
      key={vertical + horizontal}
      TransitionComponent={Grow}
    >
      <Alert
        onClose={handleClose}
        severity={feedback?.type}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarComponent;