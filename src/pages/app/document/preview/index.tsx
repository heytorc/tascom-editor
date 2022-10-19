import React, { useEffect } from "react";
import { useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  TextField,
  FormGroup,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Paper,
  Autocomplete,
  Slider,
} from "@mui/material";
import { ImageRounded } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';
import ptBrLocale from 'dayjs/locale/pt-br';
import { Rnd } from "react-rnd";

import { useDocument } from "@/commons/contexts/document.context";
import {
  EditorLabel,
  EditorBuildSwitch,
  EditorBuildCheckbox,
  EditorBuildRadio,
  EditorBuildInputText
} from '@/commons/styles/editor';

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
            <LocalizationProvider dateAdapter={DateAdapter} locale={ptBrLocale}>
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
          <FormControl>
            <RadioGroup
              row={field?.orientation === 'row'}
              aria-labelledby="demo-radio-buttons-group-label"
              name={field.tag}
            >
              {field.options?.map(({ label, value }, index) => (
                <FormControlLabel
                  key={`field_${field._id}_checkbox_option_${index}`}
                  control={(
                    <EditorBuildCheckbox
                      color="secondary"
                    />
                  )}
                  label={label}
                />
              ))}
            </RadioGroup>
          </FormControl>
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

      case 'range':
        const marks = field.options ? field.options.map(({ label, value }) => ({ label, value: parseFloat(value) })) : [];

        fieldComponent = (
          <Slider
            defaultValue={field.min}
            step={field.steps}
            min={field.min}
            max={field.max}
            valueLabelDisplay="auto"
            marks={marks}
            value={value as number}
          />
        );
        break;
      
      case 'image':
        fieldComponent = (
          <>
            {field.src ? (
              <img
                src={field.src}
                alt={''}
                width={'100%'}
                height={'100%'}
              />
            ) : (
              <Stack
                flex={1}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                width={'100%'}
              >
                <ImageRounded fontSize={'large'} color={'primary'} />
              </Stack>
            )}
          </>
        )
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
    <Stack display={'flex'} justifyContent={'space-between'}>
      <Box
        flex={1}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'flex-start'}
        height={'100vh'}
        paddingY={10}
      >
        <Paper elevation={2}>
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
        </Paper>
      </Box>
    </Stack>
  );
};

export default PreviewDocument;