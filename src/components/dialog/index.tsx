import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface IDialogProps {
  title: string,
  description: string,
  isOpen: boolean,
  changeState: React.Dispatch<React.SetStateAction<boolean>>,
  confirmCallback?: () => void,
  cancelCallback?: () => void,
  confirmButtonLabel?: string,
  cancelButtonLabel?: string,
}

export default function DialogComponent({
  title,
  description,
  isOpen = false,
  changeState,
  confirmCallback = () => { },
  cancelCallback = () => { },
  confirmButtonLabel = 'Sim',
  cancelButtonLabel = 'Não',
}: IDialogProps) {

  const handleClose = () => {
    changeState(false);
  };

  const handleConfirm = () => {
    confirmCallback();
    handleClose();
  }

  const handleCancel = () => {
    cancelCallback();
    handleClose();
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} autoFocus>{cancelButtonLabel}</Button>
          <Button onClick={handleConfirm}>{confirmButtonLabel}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}