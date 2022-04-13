import { useEffect } from "react";
import { Rnd, DraggableData, Position, ResizableDelta } from "react-rnd";
import { Box, Stack, Paper, FormGroup, FormControlLabel, Switch } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';

import { useDocument } from "@/commons/contexts/document.context";

import EditorHeader from "@/components/editor/header";
import EditorElementsList from "@/components/editor/element/list";
import ElementProperties from "@/components/editor/element/properties";
import { EditorLabel, EditorBuildInputText, EditorBuildSwitch } from '@/commons/styles/editor';

import IField from "@/commons/interfaces/IField";

export default function BuildDocument() {
  const {
    document,
    findDocument,
    fields,
    setFields,
    selectedField,
    setSelectedField,
    updateFieldLabel,
    updateFieldPosition,
    updateFieldSize
  } = useDocument();

  useEffect(() => { findDocument(1) }, []);

  const handleDragStop = (event: any, { x, y }: DraggableData) => {
    updateFieldPosition({ x, y });
  };

  const handleResize = (e: MouseEvent | TouchEvent, dir: any, elementRef: HTMLElement, delta: ResizableDelta, position: Position) => {
    updateFieldSize({
      width: parseFloat(elementRef.style.width),
      height: parseFloat(elementRef.style.height)
    })
  };

  const handleBuildField = (field: IField, index: number) => {
    let fieldComponent = <></>;
    let selectedClass: string | undefined;

    let styles: React.CSSProperties = {
      width: field.size.width,
      height: field.size.height,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      flexDirection: "column",
      transition: '.1s ease-in-out',
      padding: 5,
      cursor: 'pointer'
    };

    const selectedFieldStyles: React.CSSProperties = {
      background: '#EBF8FF30',
      borderRadius: 5,
      border: 1,
      borderStyle: 'dashed',
      borderColor: '#4FD1C5',
      transition: '.1s ease-in-out',
      height: '100%',
      cursor: 'move',
    };

    if (selectedField?._id === field._id) {
      styles = { ...styles, ...selectedFieldStyles };
      selectedClass = 'inputSelected';
    }

    const label = (
      <EditorLabel m={0} dangerouslySetInnerHTML={{ __html: field.label }} />
    );

    switch (field.type) {
      case 'text':
        fieldComponent = (
          <>
            {label}
            <EditorBuildInputText
              size="small"
              name={`${field.label}-text`}
              placeholder={field.placeholder}
              className={`${selectedClass}`}
              fullWidth
              disabled
            />
          </>
        )
        break;

      case 'date':
        fieldComponent = (
          <>
            {label}
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                onChange={(date: unknown, keyboardInputValue?: string) => { }}
                renderInput={(params) => <EditorBuildInputText size="small" className={`${selectedClass}`} {...params} />}
                value={undefined}
                disabled
              />
            </LocalizationProvider>
          </>
        );
        break;

      case 'number':
        fieldComponent = (
          <>
            {label}
            <EditorBuildInputText
              size="small"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              name={`${field.label}-number`}
              placeholder={field.placeholder}
              style={{ width: field.size.width, cursor: "move" }}
              className={`${selectedClass}`}
              fullWidth
              disabled
            />
          </>
        );
        break;

      case 'textarea':
        fieldComponent = (
          <>
            {label}
            <EditorBuildInputText
              size="small"
              name={`${field.label}-textarea`}
              placeholder={field.placeholder}
              className={`${selectedClass}`}
              rows={5}
              multiline
              fullWidth
              disabled
            />
          </>
        );
        break;

      case 'yesOrNot':
        fieldComponent = (
          <FormGroup style={{ cursor: 'move' }}>
            <FormControlLabel control={<EditorBuildSwitch className={`${selectedClass}`} defaultChecked disabled />} label={field.label} />
          </FormGroup>
        );
      break;

      default:
        fieldComponent = (
          <EditorLabel m={0} dangerouslySetInnerHTML={{ __html: field.label }} />
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
        onDragStop={handleDragStop}
        onResize={handleResize}
        enableResizing={(selectedField?._id === field._id)}
        disableDragging={!(selectedField?._id === field._id)}
        bounds="parent"
      >
        <div className="handle" style={{ ...styles }} onClick={() => {
          setSelectedField(undefined);
          setTimeout(() => setSelectedField(field), 10)
        }}>
          {fieldComponent}
        </div>
      </Rnd>
    )
  };

  return (
    <Stack
      flex={1}
    >
      <EditorHeader />
      <Stack
        flex={1}
        direction={'row'}
        justifyContent={'space-between'}
      >
        <EditorElementsList />
        {/* {documents.map((document: any, index: number) => <p key={index}>{document.name}</p>)} */}

        <Box
          flex={1}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'flex-start'}
          paddingY={5}
          height={'92vh'}
          style={{ overflowX: 'hidden' }}
        >
          <Paper elevation={2}>
            <Stack
              padding={5}
              style={{
                background: '#fff',
                borderRadius: 5,
              }}>
              <Stack
                style={{
                  width: document?.size.width,
                  height: document?.size.height,
                  position: 'relative',
                }}>
                {fields.map((field: any, index: number) => handleBuildField(field, index))}
              </Stack>
            </Stack>
          </Paper>
        </Box>

        <ElementProperties />
      </Stack>
    </Stack>
  )
}