import { useEffect } from "react";
import { Rnd, DraggableData, Position, ResizableDelta } from "react-rnd";
import {
  Box,
  Stack,
  Paper,
  FormGroup,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Autocomplete,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';
import ptBrLocale from 'dayjs/locale/pt-br';
import { useParams } from 'react-router-dom';

import { useDocument } from "@/commons/contexts/document.context";
import useQuery from "@/commons/hooks/useQuery";

import EditorHeader from "@/components/editor/header";
import EditorElementsList from "@/components/editor/element/list";
import ElementProperties from "@/components/editor/element/properties";
import {
  EditorLabel,
  EditorBuildInputText,
  EditorBuildSwitch,
  EditorBuildCheckbox,
  EditorBuildRadio
} from '@/commons/styles/editor';

import IField from "@/commons/interfaces/IField";

import './styles.scss'

export default function BuildDocument() {
  const {
    document,
    findDocument,
    fields,
    selectedField,
    setSelectedField,
    updateFieldPosition,
    updateFieldSize,
    setScrollPosition
  } = useDocument();

  const queryParams = useQuery();
  const { id } = useParams();

  const handleScroll = (currentTarget: EventTarget & HTMLDivElement) => {
    const { scrollTop } = currentTarget;
    setScrollPosition(scrollTop);
  };

  useEffect(() => {
    let version = queryParams.get("version") ?? undefined;
    if (id)
      findDocument(id, version);
  }, []);

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
      flexDirection: 'column',
      transition: '.5s ease',
      padding: 5,
      cursor: 'pointer',
    };

    const selectedFieldStyles: React.CSSProperties = {
      background: '#EBF8FF30',
      borderRadius: 5,
      border: 1,
      borderStyle: 'dashed',
      borderColor: '#4FD1C5',
      transition: '.5s ease',
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
            <LocalizationProvider dateAdapter={DateAdapter} locale={ptBrLocale}>
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

      case 'checkbox':
        fieldComponent = (
          <FormGroup style={{ cursor: 'move' }}>
            <FormControlLabel control={<EditorBuildCheckbox className={`${selectedClass}`} defaultChecked disabled />} label={field.label} />
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
                  control={<EditorBuildRadio disabled />}
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
            disabled
          />
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
    <Stack flex={1}>
      <EditorHeader />
      <Stack
        flex={1}
        direction={'row'}
        justifyContent={'space-between'}
        overflow={'none'}
      >
        <EditorElementsList />
        <Box
          flex={1}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'flex-start'}
          paddingTop={15}
          paddingBottom={10}
          height={'100vh'}
          style={{ overflowX: 'hidden' }}
          onScroll={(event) => handleScroll(event.currentTarget)}
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