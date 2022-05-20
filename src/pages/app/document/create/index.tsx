import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import {
  Autocomplete,
  Fab,
  Stack,
  TextField,
  FormGroup,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Zoom,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { Check as CheckIcon } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';
import { Rnd } from "react-rnd";

import IField from "@/commons/interfaces/IField";

import { useDocument } from "@/commons/contexts/document.context";

import {
  EditorLabel,
  EditorBuildSwitch,
  EditorBuildCheckbox,
  EditorBuildRadio,
  EditorBuildInputText
} from '@/commons/styles/editor';

interface IPreviewDocumentParams {
  id: string | undefined;
  record_id?: string | undefined;
}

const CreateDocument = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { id, record_id } = useParams();
  const { document, documentData, findDocument, fields, handleDocumentData, createDocument } = useDocument();

  const [optionsIsOpen, setOptionsIsOpen] = useState<boolean>(false);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  useEffect(() => {
    if (id)
      findDocument(id);
  }, []);

  useEffect(() => {
    if (document?._id && record_id) {
      handleDocumentData(record_id);
    } else if (document?._id) {
      createDocument();
    }
  }, [document]);

  useEffect(() => {
    if (documentData?.id)
      navigate(`/app/document/${documentData.document_id}/create/${documentData.id}`);
  }, [documentData]);

  const handleBuildField = (field: IField, index: number) => {
    let fieldComponent = <></>;
    let value;

    let styles: React.CSSProperties = {
      width: field.size.width,
      height: field.size.height,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      flexDirection: "column",
      padding: 5,
    };

    if (documentData) {
      value = documentData.fields.find(item => item.field_id === field._id)?.value;
    }

    const label = (
      <EditorLabel dangerouslySetInnerHTML={{ __html: field.label }} />
    );

    switch (field.type) {
      case 'text':
        fieldComponent = (
          <Stack style={{ ...styles }}>
            {label}
            <TextField
              size="small"
              name={`${field.label}-text`}
              placeholder={field.placeholder}
              style={{ cursor: 'move' }}
              fullWidth
            />
          </Stack>
        )
        break;

      case 'date':
        fieldComponent = (
          <Stack style={{ ...styles }}>
            {label}
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                onChange={(date: unknown, keyboardInputValue?: string) => { }}
                renderInput={(params) => <TextField size="small" {...params} />}
                value={undefined}
              />
            </LocalizationProvider>
          </Stack>
        );
        break;

      case 'number':
        fieldComponent = (
          <Stack style={{ ...styles }}>
            {label}
            <TextField
              name={`${field.label}-number`}
              placeholder={field.placeholder}
              style={{ width: field.size.width, cursor: "move" }}
              value={value}
              disabled
            />
          </Stack>
        );
        break;

      case 'textarea':
        fieldComponent = (
          <Stack style={{ ...styles }}>
            {label}
            <TextField
              size="small"
              name={`${field.label}-textarea`}
              placeholder={field.placeholder}
              value={value}
              rows={5}
              fullWidth
              multiline
            />
          </Stack>
        );
        break;

      case 'yesOrNot':
        fieldComponent = (
          <FormGroup>
            <FormControlLabel
              control={<EditorBuildSwitch color="secondary" />}
              label={field.label}
            />
          </FormGroup>
        );
        break;

      case 'checkbox':
        fieldComponent = (
          <FormGroup>
            <FormControlLabel
              control={<EditorBuildCheckbox color="secondary" />}
              label={field.label}
            />
          </FormGroup>
        );
        break;

      case 'radio':
        fieldComponent = (
          <FormControl>
            <RadioGroup
              row={field?.orientation === 'row'}
              aria-labelledby="demo-radio-buttons-group-label"
              name={field.tag}
            >
              {field.options?.map(({ label, value }, index) => (
                <FormControlLabel
                  key={`field_${field._id}_radio_option_${index}`}
                  control={<EditorBuildRadio color="secondary" />}
                  label={label}
                  value={value}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
        break;

      case 'select':
        fieldComponent = (
          <Autocomplete
            options={field.options || []}
            renderInput={(params) => <EditorBuildInputText {...params} name={field.tag} label={field.label} />}
            size="small"
            disablePortal
            fullWidth
          />
        );
        break;

      default:
        fieldComponent = (
          <EditorLabel m={0} style={{ ...field.size }} dangerouslySetInnerHTML={{ __html: field.label }} />
        );
        break;
    }

    return (
      <Rnd
        key={`editor-field-${index}`}
        default={{
          ...field.position,
          ...field.size,
        }}
        maxWidth={800}
        enableResizing={false}
        disableDragging
        bounds="parent"
      >
        <div style={{ ...styles }}>
          {fieldComponent}
        </div>
      </Rnd>
    );
  };

  const toggleOptionDialog = () => setOptionsIsOpen(!optionsIsOpen);

  return (
    <>
      <Stack display={'flex'} flex={1} alignItems={'center'} style={{ background: '#fff' }}>
        <Stack
          display={'flex'}
          style={{
            width: document?.size.width,
            height: document?.size.height,
            position: 'relative',
          }}
        >
          {fields.map((field: any, index: number) => handleBuildField(field, index))}
        </Stack>

        <Stack style={{ position: 'fixed', right: 30, bottom: 30 }}>
          <Zoom
            in
            timeout={transitionDuration}
            style={{
              transitionDelay: `${transitionDuration.exit}ms`,
            }}
            unmountOnExit
          >
            <Fab color="success" aria-label="add" onClick={toggleOptionDialog}>
              <CheckIcon />
            </Fab>
          </Zoom>
        </Stack>
      </Stack>

      <Dialog
        open={optionsIsOpen}
        onClose={toggleOptionDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Opções
        </DialogTitle>
        <DialogContent>
          <Stack gap={3}>
            <Button variant="contained" color="secondary">Salvar</Button>
            <Button variant="contained">Finalizar</Button>
            <Button variant="outlined" color="error">Desistir</Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleCancel} autoFocus>{cancelButtonLabel}</Button> */}
          {/* <Button onClick={handleConfirm}>{confirmButtonLabel}</Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDocument;