import React, { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Box, Typography, Stack, Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';
import { Rnd } from "react-rnd";

import { useDocument } from "@/commons/contexts/document.context";
import { EditorLabel } from '@/commons/styles/editor';

import IField from "@/commons/interfaces/IField";


interface IPreviewDocumentParams {
  id: string | undefined;
  record_id?: string | undefined;
}

const PreviewDocument = () => {
  const { document, documentData, findDocument, fields, handleDocumentData } = useDocument();

  const { id, record_id } = useParams();

  useEffect(() => {
    if (id)
      findDocument(id);
  }, []);

  useEffect(() => {
    if (document?._id && record_id)
      handleDocumentData(record_id)
  }, [document])

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
      value = documentData.fields.find((item: any) => item.field_id === field._id)?.value;
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
                disabled
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

  return (
    <Stack display={'flex'} bgcolor={'#ccc'} justifyContent={'space-between'}>
      <Box
        flex={1}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'flex-start'}
        height={'100vh'}
        paddingY={10}
      >
        <Stack
          padding={5}
          style={{
            background: '#fff',
            borderRadius: 5,
          }}>
          {document && (
            <Stack
              style={{
                width: document?.size.width,
                height: document?.size.height,
                position: 'relative',
              }}>
              {fields.map((field: any, index: number) => handleBuildField(field, index))}
            </Stack>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

export default PreviewDocument;