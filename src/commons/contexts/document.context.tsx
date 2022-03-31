import React, { createContext, FC, useContext, useState } from "react";
import { v1 as uuidv1 } from 'uuid';

import IField, { FieldType } from "@/commons/interfaces/IField";
import IPage from "@/commons/interfaces/IPage";
import FieldsDefaultProps from "@/commons/constants/fields/default.configuration";

interface IDocumentContext {
  fields: IField[],
  setFields: React.Dispatch<React.SetStateAction<IField[]>>,
  selectedField: IField | undefined,
  setSelectedField: React.Dispatch<React.SetStateAction<IField | undefined>>,
  createField: (type: FieldType) => void,
  deleteField: () => void,
  updateLabel: (value: string) => void,
  updatePosition: (position: IFieldPosition, only?: "x" | "y") => void,
  updateSize: (size: IFieldSize, only?: "width" | "height") => void,
}

interface IFieldPosition {
  x: number;
  y: number;
}

interface IFieldSize {
  width: number | string;
  height: number | string;
}

export const DocumentContext = createContext({} as IDocumentContext);

export const DocumentProvider: FC = ({ children }) => {
  const [pages, setPages] = useState<IPage[]>();

  const [fields, setFields] = useState<IField[]>([])
  const [selectedField, setSelectedField] = useState<IField>();

  const createField = (type: FieldType) => {
    let field = FieldsDefaultProps[type];
    field = {
      ...field,
      _id: uuidv1()
    };

    const fieldsCopy = [...fields];
    fieldsCopy.push(field);

    setFields(fieldsCopy);
    setSelectedField(field);
  };

  const deleteField = () => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy.splice(fieldKey, 1);

      setSelectedField(undefined);
      setFields(fieldsCopy);
    }
  };

  const updateLabel = (value: string) => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].label = value;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const updatePosition = (position: IFieldPosition, only?: "x" | "y") => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)

      if (only) {
        fieldsCopy[fieldKey].position[only] = position[only];
      } else {
        fieldsCopy[fieldKey].position = position;
      }

      setFields(fieldsCopy);
    }
  };

  const updateSize = (size: IFieldSize, only?: "width" | "height") => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)

      if (only) {
        fieldsCopy[fieldKey].size[only] = size[only];
      } else {
        fieldsCopy[fieldKey].size = size;
      }

      setFields(fieldsCopy);
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        fields,
        setFields,
        selectedField,
        setSelectedField,
        createField,
        deleteField,
        updateLabel,
        updatePosition,
        updateSize
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => useContext(DocumentContext);