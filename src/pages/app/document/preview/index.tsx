import React, { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Box, Typography, Stack, Button, TextField } from "@mui/material"

import { useDocument } from "@/commons/contexts/document.context";
import { Rnd } from "react-rnd";

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

    if (documentData) {
      value = documentData.fields.find((item: any) => item.field_id === field._id)?.value;
    }

    const label = (
      <Typography>
        {field.label}
      </Typography>
    );

    switch (field.type) {
      case 'text':
        fieldComponent = (
          <Stack style={{ ...field.size }}>
            {label}
            <TextField
              size="medium"
              name={`${field.label}-text`}
              placeholder={field.placeholder}
              value={value}
            />
          </Stack>
        )
        break;

      case 'date':
        fieldComponent = (
          <Stack style={{ ...field.size }}>
            {label}
            <input
              type="date"
              name={`${field.label}-date`}
              placeholder={field.placeholder}
              value={value}
            // style={{ width: field.size.width, height: field.size.height }}
            />
          </Stack>
        );
        break;

      case 'number':
        fieldComponent = (
          <Stack style={{ ...field.size }}>
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
          <Stack style={{ ...field.size }}>
            {label}
            <TextField
              multiline
              name={`${field.label}-textarea`}
              placeholder={field.placeholder}
              value={value}
            />
          </Stack>
        );
        break;

      default:
        fieldComponent = (
          <Typography style={{ ...field.size }}>
            {field.label}
          </Typography>
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
        <div>
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
                width: 800,
                height: 1000,
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