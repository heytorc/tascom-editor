import React, { createRef, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  FormGroup,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useReactToPrint } from 'react-to-print';

import { useDocument } from "@/commons/contexts/document.context";
import {
  EditorLabel,
  EditorBuildSwitch,
  EditorBuildCheckbox,
  EditorBuildRadio,
} from '@/commons/styles/editor';

import IField from "@/commons/interfaces/IField";


interface IPreviewDocumentParams {
  id: string | undefined;
  record_id?: string | undefined;
}

const PrintDocument = () => {
  const { document, documentData, findDocument, fields, handleDocumentData, setFields } = useDocument();

  const { id, record_id } = useParams();

  const [incrementY, setIncrementY] = useState<number>(0);
  const [startIncrement, setStartIncrement] = useState<number | undefined>(0);
  // let incrementY: number = 0;

  const documentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
  });

  useEffect(() => {
    if (id)
      findDocument(id);
  }, []);

  useEffect(() => {
    console.log(incrementY);
  }, [incrementY])

  useEffect(() => {
    if (document?._id && record_id)
      handleDocumentData(record_id)
  }, [document]);

  useEffect(() => {
    if (documentData) {
      formatFieldsPosition();
    }
  }, [documentData]);

  useEffect(() => handlePrint(), [fields]);


  const handleBuildField = useCallback((field: IField, index: number) => {
    let fieldComponent = <></>;
    let value;
    let top = field.position.y;

    // if (startIncrement && index > startIncrement) top += incrementY;

    // TODO - Capturar altura do campo para aumentar o eixo y e evitar sobreposição dos elementos
    // TODO - Reordenar os campos automaticamente na consturção do documento baseado no valor do eixo y para que fiquem em ordem cronologica do documento e evite que o campo fique fora de ordem quando for feita a correção da sobreposição comentado anteriormente.

    let styles: React.CSSProperties = {
      width: field.size.width,
      pageBreakBefore: 'always',
      position: 'absolute',
      top,
      left: field.position.x,
    };

    if (documentData) {
      value = documentData.fields.find((item: any) => item.field_id === field._id)?.value;
    }

    const label = (
      <EditorLabel dangerouslySetInnerHTML={{ __html: field.label }} />
    );

    switch (field.type) {
      case 'text':
      case 'date':
      case 'number':
      case 'select':
        fieldComponent = (
          <Stack>
            {label}
            <Typography>{value}</Typography>
          </Stack>
        )
        break;

      case 'textarea':
        fieldComponent = (
          <Stack>
            {label}
            {value}
          </Stack>
        )
        break;

      case 'yesOrNot':
        fieldComponent = (
          <Stack>
            <FormGroup>
              <FormControlLabel
                control={<EditorBuildSwitch color="secondary" />}
                label={field.label}
                disabled
              />
            </FormGroup>
          </Stack>
        );
        break;

      case 'checkbox':
        fieldComponent = (
          <Stack>
            <FormGroup>
              <FormControlLabel
                control={<EditorBuildCheckbox color="secondary" />}
                label={field.label}
                disabled
              />
            </FormGroup>
          </Stack>
        );
        break;

      case 'radio':
        fieldComponent = (
          <Stack>
            <FormControl disabled>
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
          </Stack>
        );
        break;

      default:
        fieldComponent = (
          <Stack>
            <EditorLabel m={0} dangerouslySetInnerHTML={{ __html: field.label }} />
          </Stack>
        );
        break;
    }

    const fieldElement = (
      <div
        key={`field_${index}`}
        style={styles}
      >
        {fieldComponent}
      </div>
    );

    // console.log('position', field.position.y);

    // if (fieldRef?.current && fieldRef?.current?.clientHeight > field.size.height) {
    //   if (!startIncrement || (index <= startIncrement)) {
    //     setStartIncrement(index);
    //     setIncrementY(200);
    //   }
    // }

    // if ((top + field.size.height) < (beforeElementY + beforeElementHeight)) {
    //   spacer = <Divider />
    // }

    return fieldElement;
  }, [documentData, fields]);

  // Isso aqui ta a maior gabiarra
  const formatFieldsPosition = () => {
    const fieldsCopy = [...fields];
    let refIndex: number;

    fieldsCopy.map((field, index) => {
      if (field.type === 'textarea') {
        if (!refIndex) {
          refIndex = index;
        }
      }

      if (refIndex >= 0 && refIndex !== index) fieldsCopy[index].position.y += 180;
    });

    setFields(fieldsCopy);
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
        <Stack
          ref={documentRef} 
          padding={5}
          style={{
            background: '#fff',
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

export default PrintDocument;