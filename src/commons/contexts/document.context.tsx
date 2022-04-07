import React, { createContext, FC, useContext, useEffect, useState } from "react";
import { v1 as uuidv1 } from 'uuid';

import IField from "@/commons/interfaces/IField";
import { FieldType } from "@/commons/types/field.types";
import IPage from "@/commons/interfaces/IPage";
import FieldsDefaultProps from "@/commons/constants/fields/default.configuration";
import IDocument from "@/commons/interfaces/IDocument";
import api from "../services/api";

interface IDocumentContext {
  fields: IField[],
  setFields: React.Dispatch<React.SetStateAction<IField[]>>,
  selectedField: IField | undefined,
  setSelectedField: React.Dispatch<React.SetStateAction<IField | undefined>>,
  document: IDocument | undefined,
  setDocument: React.Dispatch<React.SetStateAction<IDocument | undefined>>,
  documentData: any,
  setDocumentData: React.Dispatch<React.SetStateAction<any>>,
  findDocument: (id: number | string) => void,
  saveDocument: () => void,
  handleDocumentData: (id: number | string) => void,
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
  width: number;
  height: number;
}

export const DocumentContext = createContext({} as IDocumentContext);

export const DocumentProvider: FC = ({ children }) => {
  const [pages, setPages] = useState<IPage[]>();

  const [document, setDocument] = useState<IDocument>();
  const [documentData, setDocumentData] = useState<any>();

  const [fields, setFields] = useState<IField[]>([])
  const [selectedField, setSelectedField] = useState<IField>();

  useEffect(() => console.log(fields), [fields]);

  useEffect(() => {
    fillDocumentFields();
  }, [document]);

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
        fieldsCopy[fieldKey].size[only] = isNaN(size[only]) ? 0 : size[only] ;
      } else {
        fieldsCopy[fieldKey].size = size;
      }

      setFields(fieldsCopy);
    }
  };

  const fillDocumentFields = () => {
    if (document) {
      const { version, versions } = document;

      const actualVersion = versions.find(item => item.number === version);

      if (actualVersion)
        setFields(actualVersion.fields);
    }
  };

  const findDocument = async (id: number | string) => {
    const { data: document }: any = await api.get(`/documents?id=${id}`);

    if (document[0]) {
      setDocument(document[0]);
    }
  };

  const handleDocumentData = async (id: number | string) => {
    const { data: document }: any = await api.get(`/completed_documents?id=${id}`);

    if (document) {
      setDocumentData(document);
    }
  };

  const saveDocument = async () => {
    if (document) {
      const { version, versions } = document;

      const actualIndexVersion = versions.findIndex(item => item.number === version);

      if (actualIndexVersion > -1) {
        const data = { ...document };
        data.versions[actualIndexVersion].fields = fields;

        const documentSaved = await api.put(`/documents/${document._id}`, data);

        console.log(documentSaved);
      }
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        document,
        setDocument,
        fields,
        setFields,
        selectedField,
        setSelectedField,
        findDocument,
        saveDocument,
        handleDocumentData,
        documentData,
        setDocumentData,
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