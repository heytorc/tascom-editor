import React, { useCallback, useEffect, useState } from "react";
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
  DialogTitle,
  Divider
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { Info as InfoIcon } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';
import { Rnd } from "react-rnd";
import { debounce } from "lodash";

import IField from "@/commons/interfaces/IField";

import { useDocument } from "@/commons/contexts/document.context";

import {
  EditorLabel,
  EditorBuildSwitch,
  EditorBuildCheckbox,
  EditorBuildRadio,
  EditorBuildInputText
} from '@/commons/styles/editor';
import dayjs from "dayjs";
import { ICompletedDocument, ICompletedDocumentField } from "@/commons/interfaces/document/ICompletedDocument";

import { DocumentContainer } from "./styles";

interface IPreviewDocumentParams {
  id: string | undefined;
  record_id?: string | undefined;
}

const CreateDocument = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { id, record_id } = useParams();
  const {
    document,
    documentData,
    findDocument,
    fields,
    handleDocumentData,
    createDocument,
    saveDocumentFill,
    finishDocument,
    quitDocument,
    cancelDocument
  } = useDocument();

  const [documentCurrentData, setDocumentCurrentData] = useState<ICompletedDocument | undefined>();

  const [optionsIsOpen, setOptionsIsOpen] = useState<boolean>(false);
  const [finishDialogIsOpen, setFinishDialogIsOpen] = useState<boolean>(false);
  const [quitDialogIsOpen, setQuitDialogIsOpen] = useState<boolean>(false);
  const [cancelDialogIsOpen, setCancelDialogIsOpen] = useState<boolean>(false);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  useEffect(() => {
    if (id) findDocument(id);
    if (record_id) handleDocumentData(record_id);
  }, []);

  useEffect(() => {
    if (document?._id && !documentData?.id && record_id) {
      handleDocumentData(record_id);
    } else if (document?._id && !documentData?.id) {
      createDocument();
    }
  }, [document]);

  useEffect(() => {
    setDocumentCurrentData(documentData);
    if (documentData?.id && !record_id) {
      navigate(`/app/document/${documentData.document_id}/create/${documentData.id}`);
    }
  }, [documentData]);

  const handleFieldValue = useCallback((id: string) => (
    documentCurrentData?.fields.find(item => item.field_id === id)?.value
  ), [documentCurrentData]);

  const handleFieldChangeValue = (data: ICompletedDocument) => {
    if (data?.id) {
      saveDocumentFill(data?.id, undefined, data);
    }
  };

  const debounceFieldChangeValue = useCallback(debounce(data => handleFieldChangeValue(data), 500), []);

  const handleChange = ({ field_id, value }: ICompletedDocumentField) => {
    if (documentData) {
      if (documentData.status !== 'filling') return;

      const documentCurrentDataCopy: ICompletedDocument = { ...documentData };

      const fieldIndex = documentCurrentDataCopy.fields?.findIndex((item: any) => item.field_id === field_id) ?? -1;

      if (documentCurrentDataCopy?.fields) {
        if (fieldIndex > -1) {
          documentCurrentDataCopy.fields[fieldIndex].value = value;
        } else {
          documentCurrentDataCopy.fields.push({ field_id, value })
        }
        setDocumentCurrentData(documentCurrentDataCopy);
        debounceFieldChangeValue(documentCurrentDataCopy);
      }
    }
  };

  const handleBuildField = (field: IField, index: number) => {
    let fieldComponent = <></>;

    let styles: React.CSSProperties = {
      width: field.size.width,
      height: field.size.height,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      flexDirection: "column",
      padding: 5,
    };

    const label = (
      <EditorLabel dangerouslySetInnerHTML={{ __html: field.label }} />
    );

    const isDisabled = documentData?.status !== 'filling';

    const value = handleFieldValue(field._id) ?? '';

    switch (field.type) {
      case 'text':
        fieldComponent = (
          <Stack style={{ ...styles }}>
            {label}
            <TextField
              size="small"
              name={`${field.label}-text`}
              placeholder={field.placeholder}
              onChange={(element) => {
                handleChange({ field_id: field._id, value: element.target.value })
              }}
              value={value}
              disabled={isDisabled}
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
                onChange={(date: Date | null, keyboardInputValue?: string) => { handleChange({ field_id: field._id, value: dayjs(date).toISOString() }) }}
                renderInput={(params) => <TextField size="small" {...params} />}
                value={`${value}`}
                disabled={isDisabled}
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
              onChange={(element) => handleChange({ field_id: field._id, value: element.target.value })}
              value={value}
              disabled={isDisabled}
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
              onChange={(element) => handleChange({ field_id: field._id, value: element.target.value })}
              value={value}
              disabled={isDisabled}
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
              control={(
                <EditorBuildSwitch
                  color="secondary"
                  onChange={(element, checked) => handleChange({ field_id: field._id, value: checked })}
                  checked={!!value}
                  disabled={isDisabled}
                />
              )}
              label={field.label}
            />
          </FormGroup>
        );
        break;

      case 'checkbox':
        fieldComponent = (
          <FormGroup>
            <FormControlLabel
              control={(
                <EditorBuildCheckbox
                  color="secondary"
                  onChange={(element, checked) => handleChange({ field_id: field._id, value: checked })}
                  checked={!!value}
                />
              )}
              label={field.label}
              disabled={isDisabled}
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
              {field.options?.map(({ label, value: fieldValue }, index) => (
                <FormControlLabel
                  key={`field_${field._id}_radio_option_${index}`}
                  control={(
                    <EditorBuildRadio
                      color="secondary"
                      onChange={(element, checked) => handleChange({ field_id: field._id, value: fieldValue })}
                    />
                  )}
                  label={label}
                  checked={fieldValue === value}
                  value={fieldValue}
                  disabled={isDisabled}
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
            onChange={(event, fieldOption) => {
              if (fieldOption?.value) handleChange({ field_id: field._id, value: fieldOption?.value })
            }}
            disabled={isDisabled}
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

  const toggleFinishDialog = () => setFinishDialogIsOpen(!finishDialogIsOpen);

  const toggleQuitDialog = () => setQuitDialogIsOpen(!quitDialogIsOpen);

  const toggleCancelDialog = () => setCancelDialogIsOpen(!cancelDialogIsOpen);

  const handleFinishDocument = async () => {
    toggleOptionDialog();
    toggleFinishDialog();
    finishDocument();
  };

  const handleQuitDocument = async () => {
    toggleOptionDialog();
    toggleQuitDialog();
    quitDocument();
    navigate('/app');
  };

  const handleCancelDocument = async () => {
    toggleOptionDialog();
    toggleCancelDialog();
    cancelDocument();
  };

  const handlePrintDocument = useCallback(() => {
    window.open(`/app/document/${documentData?.document_id}/print/${documentData?.id}`);
  }, [documentData]);

  return (
    <>
      <Stack
        display={'flex'}
        flex={1}
        alignItems={'center'}
        style={{
          background: '#fff',
          width: '100%',
          height: document?.size.height
        }}
      >
        <DocumentContainer
          style={{
            width: document?.size.width,
            height: document?.size.height,
          }}
        >
          {fields?.map((field, index: number) => handleBuildField(field, index))}
        </DocumentContainer>
      </Stack>

      {/* FAB Button */}
      <Stack style={{ position: 'fixed', right: 30, bottom: 30 }}>
        <Zoom
          in
          timeout={transitionDuration}
          style={{
            transitionDelay: `${transitionDuration.exit}ms`,
          }}
          unmountOnExit
        >
          <Fab color="secondary" aria-label="more_options" onClick={toggleOptionDialog}>
            <InfoIcon />
          </Fab>
        </Zoom>
      </Stack>

      {/* Options Dialog */}
      <Dialog
        open={optionsIsOpen}
        onClose={toggleOptionDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Opções
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack gap={3}>
            {documentData?.status === 'finished' && (
              <>
                <Button variant="contained" onClick={toggleQuitDialog} color="secondary">Imprimir</Button>
                <Button variant="outlined" onClick={toggleCancelDialog} color="error">Cancelar</Button>
              </>
            )}
            {documentData?.status === 'filling' && (
              <>
                <Button variant="contained" onClick={toggleFinishDialog} color="success">Finalizar</Button>
                <Button variant="outlined" onClick={toggleQuitDialog} color="error">Desistir</Button>
              </>
            )}
            {documentData?.status === 'canceled' && (
              <Button variant="contained" onClick={handlePrintDocument} color="secondary">Imprimir</Button>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Finish Dialog */}
      <Dialog
        open={finishDialogIsOpen}
        onClose={toggleFinishDialog}
        aria-labelledby="finish-dialog-title"
        aria-describedby="finish-dialog-description"
      >
        <DialogTitle id="finish-dialog-title">
          Finalizar Documento
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="finish-dialog-description">
            Deseja finalizar este documento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { }}>Não</Button>
          <Button onClick={handleFinishDocument} autoFocus>Sim</Button>
        </DialogActions>
      </Dialog>

      {/* Quit Dialog */}
      <Dialog
        open={quitDialogIsOpen}
        onClose={toggleQuitDialog}
        aria-labelledby="quit-dialog-title"
        aria-describedby="quit-dialog-description"
      >
        <DialogTitle id="quit-dialog-title">
          Desistir do Documento
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="quit-dialog-description">
            Deseja desistir do preenchimento deste documento?
          </DialogContentText>

          <DialogContentText color="error" id="quit-dialog-alert">
            Esta operação não poderá ser desfeita!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { }}>Não</Button>
          <Button onClick={handleQuitDocument} autoFocus>Sim</Button>
        </DialogActions>
      </Dialog>

      {/* Cencel Dialog */}
      <Dialog
        open={cancelDialogIsOpen}
        onClose={toggleCancelDialog}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title">
          Desistir do Documento
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Deseja cancelar este documento?
          </DialogContentText>

          <DialogContentText color="error" id="cancel-dialog-alert">
            Esta operação não poderá ser desfeita!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { }}>Não</Button>
          <Button onClick={handleCancelDocument} autoFocus>Sim</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDocument;