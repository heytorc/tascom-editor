import React, { createContext, FC, useContext, useEffect, useState } from "react";
import { v1 as uuidv1 } from 'uuid';

import IField, { IFieldOptions } from "@/commons/interfaces/IField";
import { FieldType, FieldOrientationType } from "@/commons/types/field.types";
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
  updateFieldLabel: (value: string) => void,
  updateFieldTag: (value: string) => void,
  updateFieldPlaceholder: (value: string) => void,
  updateFieldPosition: (position: IFieldPosition, only?: "x" | "y") => void,
  updateFieldSize: (size: IElementSize, only?: "width" | "height") => void,
  documents: IDocument[],
  handleDocuments: () => void,
  updateDocumentSize: (size: IElementSize, only?: "width" | "height") => void,
  addFieldOptions: (option: IFieldOptions) => void,
  updateFieldOptions: (options: IFieldOptions[]) => void,
  deleteFieldOption: (index: number) => void,
  updateFieldOrientation: (orientation: FieldOrientationType) => void,
  updateFieldOptionData: (optionIndex: number, prop: 'value' | 'label', value: string) => void,
}

interface IFieldPosition {
  x: number;
  y: number;
}

interface IElementSize {
  width: number;
  height: number;
}

export const DocumentContext = createContext({} as IDocumentContext);

export const DocumentProvider: FC = ({ children }) => {
  const [pages, setPages] = useState<IPage[]>();

  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [document, setDocument] = useState<IDocument>();
  const [documentData, setDocumentData] = useState<any>();

  const [fields, setFields] = useState<IField[]>([])
  const [selectedField, setSelectedField] = useState<IField>();

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

  const updateFieldLabel = (value: string) => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].label = value;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const updateFieldTag = (value: string) => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].tag = value;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const updateFieldPlaceholder = (value: string) => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].placeholder = value;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const updateFieldPosition = (position: IFieldPosition, only?: "x" | "y") => {
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

  const updateFieldSize = (size: IElementSize, only?: "width" | "height") => {
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
  
  const handleDocuments = async () => {
    const { data } = await api.get<any[]>(`/documents`);

    setDocuments(data);
  };

  const updateDocumentSize = (size: IElementSize, only?: "width" | "height") => {
    if (document) {
      let documentCopy = {...document };

      if (only) {
        documentCopy.size[only] = isNaN(size[only]) ? 0 : size[only] ;
      } else {
        documentCopy.size = size;
      }

      setDocument(documentCopy);
    }
  };
  
  const addFieldOptions = (option: IFieldOptions) => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].options?.push(option);

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const updateFieldOptions = (options: IFieldOptions[]) => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].options = options;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const deleteFieldOption = (index: number) => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id);
      
      let { options } = fieldsCopy[fieldKey];
      options?.splice(index, 1);

      fieldsCopy[fieldKey].options = options;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };
  
  const updateFieldOrientation = (orientation: FieldOrientationType) => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id);
      fieldsCopy[fieldKey].orientation = orientation;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const updateFieldOptionData = (optionIndex: number, prop: 'value' | 'label', value: string) => {
    if (selectedField) {
      let fieldsCopy = [...fields];

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id);
      let optionsCopy = fieldsCopy[fieldKey].options;
      
      if (optionsCopy) {
        optionsCopy[optionIndex][prop] = value;  
      }

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  }

  return (
    <DocumentContext.Provider
      value={{
        document,
        documents,
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
        updateFieldLabel,
        updateFieldPlaceholder,
        updateFieldPosition,
        updateFieldSize,
        handleDocuments,
        updateDocumentSize,
        addFieldOptions,
        updateFieldOptions,
        deleteFieldOption,
        updateFieldOrientation,
        updateFieldTag,
        updateFieldOptionData
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => useContext(DocumentContext);