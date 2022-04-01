import { useEffect } from "react";
import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Input,
  Textarea,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  EditableTextarea,
  Stack
} from "@chakra-ui/react";
import { Rnd, DraggableData, Position, ResizableDelta } from "react-rnd";

import { useDocument } from "@/commons/contexts/document.context";

import EditorElementsList from "@/components/editor/element/list";
import ElementProperties from "@/components/editor/element/properties";

import IField from "@/commons/interfaces/IField";

export default function CreateDocument() {
  const {
    findDocument,
    fields,
    setFields,
    selectedField,
    setSelectedField,
    updateLabel,
    updatePosition,
    updateSize
  } = useDocument();

  useEffect(() => { findDocument(1) }, []);

  const handleDragStop = (event: any, { x, y }: DraggableData) => {
    updatePosition({ x, y });
  };

  const handleResize = (e: MouseEvent | TouchEvent, dir: any, elementRef: HTMLElement, delta: ResizableDelta, position: Position) => {
    updateSize({
      width: elementRef.style.width,
      height: elementRef.style.height
    })
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
      transition: '.2s ease',
    };

    const selectedFieldStyles: React.CSSProperties = {
      background: '#EBF8FF30',
      borderRadius: 5,
      border: 1,
      borderStyle: 'dashed',
      borderColor: '#4FD1C5',
      padding: 5,
      transition: '.2s ease',
    };

    if (selectedField?._id === field._id) {
      styles = { ...styles, ...selectedFieldStyles };
    }

    switch (field.type) {
      case 'text':
        fieldComponent = (
          <>
            <Editable defaultValue={field.label} onChange={(value: string) => updateLabel(value)}>
              <EditablePreview />
              <EditableInput
                onDoubleClick={(element) => element.currentTarget.select()}
                w={field.size.width}
              />
            </Editable>
            <Input
              size='md'
              name={`${field.label}-text`}
              placeholder={field.placeholder}
              style={{ cursor: 'move' }}
              disabled
            />
          </>
        )
        break;

      case 'date':
        fieldComponent = (
          <>
            <Editable defaultValue={field.label} onChange={(value: string) => updateLabel(value)}>
              <EditablePreview />
              <EditableInput
                onDoubleClick={(element) => element.currentTarget.select()}
                w={field.size.width}
              />
            </Editable>
            <input
              type="date"
              name={`${field.label}-date`}
              placeholder={field.placeholder}
              style={{ width: field.size.width, height: field.size.height, cursor: "move" }}
              disabled
            />
          </>
        );
        break;

      case 'number':
        fieldComponent = (
          <>
            <Editable defaultValue={field.label} onChange={(value: string) => updateLabel(value)}>
              <EditablePreview />
              <EditableInput
                onDoubleClick={(element) => element.currentTarget.select()}
                w={field.size.width}
              />
            </Editable>
            <NumberInput
              isDisabled
            >
              <NumberInputField
                name={`${field.label}-number`}
                placeholder={field.placeholder}
                style={{ width: field.size.width, cursor: "move" }}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </>
        );
        break;

      case 'textarea':
        fieldComponent = (
          <>
            <Editable defaultValue={field.label} onChange={(value: string) => updateLabel(value)}>
              <EditablePreview />
              <EditableInput
                onDoubleClick={(element) => element.currentTarget.select()}
                w={field.size.width}
              />
            </Editable>
            <Textarea
              name={`${field.label}-textarea`}
              placeholder={field.placeholder}
              style={{ cursor: "move" }}
              disabled
            >
            </Textarea>
          </>
        );
        break;

      default:
        fieldComponent = (
          <Editable
            defaultValue={field.label}
            style={{ width: field.size.width, height: field.size.height, cursor: "move" }}
            onChange={(value: string) => updateLabel(value)}
          >
            <EditablePreview style={{ cursor: "move" }} />
            <EditableTextarea
              onDoubleClick={(element) => element.currentTarget.select()}
              style={{ height: field.size.height, padding: 0 }}
            />
          </Editable>
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
        disableDragging={!(selectedField?._id === field._id)}
        bounds="parent"
      >
        <div className="handle" style={{ ...styles }} onClick={() => setSelectedField(field)}>
          {fieldComponent}
        </div>
      </Rnd>
    )
  };

  return (
    <Flex bg={'gray.200'} justifyContent={'space-between'}>
      <EditorElementsList
        fields={fields}
        setFields={setFields}
      />
      {/* {documents.map((document: any, index: number) => <p key={index}>{document.name}</p>)} */}
      <Box
        flex={1}
        overflowX={'hidden'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'flex-start'}
        h={'100vh'}
        paddingY={10}
      >
        <Stack
          padding={5}
          style={{
            background: '#fff',
            borderRadius: 5,
          }}>
          <Stack
            style={{
              width: 800,
              height: 1000,
              position: 'relative',
            }}>
            {fields.map((field: any, index: number) => handleBuildField(field, index))}
          </Stack>
        </Stack>
      </Box>

      {selectedField && (
        <ElementProperties />
      )}
    </Flex>
  )
}