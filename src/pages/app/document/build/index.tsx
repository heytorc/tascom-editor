import { useCallback, useEffect, useRef } from "react";
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
  Slider,
} from "@mui/material";
import { ImageRounded } from '@mui/icons-material';
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
    clearContext,
    grid
  } = useDocument();

  const gridRef = useRef<HTMLCanvasElement>(null);

  const queryParams = useQuery();
  const { id } = useParams();

  useEffect(() => {
    let version = queryParams.get("version") ?? undefined;

    clearContext();

    if (id) findDocument(id, version);
  }, []);

  useEffect(() => {
    renderGrid();
  }, [document, grid])

  const handleDragStop = (event: any, { x, y }: DraggableData) => {
    const [gridX, gridY] = grid;

    const position = {
      x: Math.ceil(x / gridX) * gridX,
      y: Math.ceil(y / gridY) * gridY
    }

    console.log('position', position)

    updateFieldPosition(position);
  };

  const handleResize = (e: MouseEvent | TouchEvent, dir: any, elementRef: HTMLElement, delta: ResizableDelta, position: Position) => {
    const [gridX, gridY] = grid;

    const size = {
      width: Math.ceil(parseFloat(elementRef.style.width) / gridX) * gridX,
      height: Math.ceil(parseFloat(elementRef.style.height) / gridY) * gridY
    }

    updateFieldSize(size)
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
      cursor: 'pointer',
    };

    const selectedFieldStyles: React.CSSProperties = {
      background: '#EBF8FF',
      border: 0,
      borderStyle: 'dashed',
      borderColor: '#4FD1C5',
      height: (field.label && field.type === 'textarea') ? field.size.height + 50 : field.size.height,
      cursor: 'move',
    };

    if (selectedField?._id === field._id) {
      styles = { ...styles, ...selectedFieldStyles };
      selectedClass = 'inputSelected';
    }

    const label = (
      field.label.length > 0 || field.label !== '<p><br></p>' ? <EditorLabel m={0} dangerouslySetInnerHTML={{ __html: field.label }} /> : <></>
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
                value={null}
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
          <FormControl>
            <RadioGroup
              row={field?.orientation === 'row'}
              aria-labelledby="demo-radio-buttons-group-label"
              name={field.tag}
            >
              {field.options?.map(({ label, value }, index) => (
                <FormControlLabel
                  key={`field_${field._id}_checkbox_option_${index}`}
                  control={<EditorBuildCheckbox className={`${selectedClass}`} defaultChecked disabled />}
                  label={label}
                  value={value}
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

      case 'range':
        const marks = field.options ? field.options.map(({ label, value }) => ({ label, value: parseFloat(value) })) : [];

        fieldComponent = (
          <Slider
            defaultValue={0}
            getAriaValueText={value => `${value}`}
            step={field.steps}
            min={field.min}
            max={field.max}
            valueLabelDisplay="auto"
            marks={marks}
            disabled
          />
        )
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
          <EditorLabel m={0} dangerouslySetInnerHTML={{ __html: field.label }} />
        );
        break;
    }

    return (
      <Rnd
        id={`editor-field-${index}`}
        key={`editor-field-${index}`}
        bounds="parent"
        default={{
          ...field.position,
          ...field.size,
        }}
        dragGrid={grid}
        resizeGrid={grid}
        maxWidth={800}
        onDragStop={handleDragStop}
        onResize={handleResize}
        enableResizing={(selectedField?._id === field._id)}
        disableDragging={!(selectedField?._id === field._id)}
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

  const renderGrid = () => {
    if (document) {
      //grid width and height
      var bw = document.size.width;
      var bh = document.size.height;
      //padding around grid
      var p = 0;

      if (gridRef) {
        const canvas = gridRef;

        const context = canvas.current?.getContext('2d');

        if (context) {
          context.strokeStyle = "#cccccc30";
          context.clearRect(0, 0, bw, bh)

          for (var x = 0; x <= bw; x += grid[0]) {
            context?.beginPath()
            context.moveTo(0.5 + x + p, p);
            context.lineTo(0.5 + x + p, bh + p);
            context.stroke();
          }


          for (var x = 0; x <= bh; x += grid[0]) {
            context?.beginPath()
            context.moveTo(p, 0.5 + x + p);
            context.lineTo(bw + p, 0.5 + x + p);
            context.stroke();
          }
        }
      }
    }
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
          style={{ overflow: 'scroll' }}
        >
          <Paper elevation={2}>
            <Stack
              padding={5}
              style={{
                background: '#fff',
                borderRadius: 5,
              }}
            >
              <Stack style={{ position: 'relative', padding: 0 }}>
                <canvas
                  ref={gridRef}
                  width={document?.size?.width}
                  height={document?.size?.height}
                  style={{ position: 'absolute' }}
                >
                </canvas>

                <Stack
                  className="dragging-container"
                  style={{
                    width: document?.size.width,
                    height: document?.size.height,
                    position: 'relative',
                  }}>
                  {fields.map((field: any, index: number) => handleBuildField(field, index))}
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Box>

        <ElementProperties />
      </Stack>
    </Stack>
  )
}