import React, { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { v1 as uuidv1 } from 'uuid';

import IField, { IFieldOptions } from "@/commons/interfaces/IField";
import { FieldType, FieldOrientationType } from "@/commons/types/field.types";
import IPage from "@/commons/interfaces/IPage";
import FieldsDefaultProps from "@/commons/constants/fields/default.configuration";
import IDocument, { IDocumentVersion } from "@/commons/interfaces/IDocument";
import api from "../services/api";

interface IDocumentContext {
  fields: IField[],
  setFields: React.Dispatch<React.SetStateAction<IField[]>>,
  selectedField: IField | undefined,
  setSelectedField: React.Dispatch<React.SetStateAction<IField | undefined>>,
  document: IDocument | undefined,
  setDocument: React.Dispatch<React.SetStateAction<IDocument | undefined>>,
  documentData: IDocument | undefined,
  currentVersion: IDocumentVersion | undefined,
  setDocumentData: React.Dispatch<React.SetStateAction<any>>,
  targetVersion: number | string | undefined,
  setTargetVersion: React.Dispatch<React.SetStateAction<number | string | undefined>>,
  findDocument: (id: number | string, version?: number | string) => void,
  saveDocument: () => Promise<IDocument | undefined>,
  handleDocumentData: (id: number | string) => void,
  updateDocumentName: (name: string) => void,
  toggleActiveDocument: (isActived: boolean) => void,
  publishDocument: () => void,
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
  handleBuildingVersion: (currentDocument?: IDocument) => ICurrentDocument | undefined,
  deleteVersion: () => void,
  scrollPosition: number,
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>,
}

interface IFieldPosition {
  x: number;
  y: number;
}

interface IElementSize {
  width: number;
  height: number;
}

interface ICurrentDocument {
  data: IDocumentVersion;
  index: number;
}

export const DocumentContext = createContext({} as IDocumentContext);

export const DocumentProvider: FC = ({ children }) => {
  const [pages, setPages] = useState<IPage[]>();
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [document, setDocument] = useState<IDocument>();
  const [documentData, setDocumentData] = useState<any>();
  const [targetVersion, setTargetVersion] = useState<number | string>();

  const [currentVersion, setCurrentVersion] = useState<IDocumentVersion>();
  const [fields, setFields] = useState<IField[]>([]);
  const [selectedField, setSelectedField] = useState<IField>();

  useEffect(() => {
    fillDocumentFields();
  }, [document, targetVersion]);

  const handleBuildingVersion = useCallback((currentDocument?: IDocument): ICurrentDocument | undefined => {
    const doc = document || currentDocument;

    if (doc) {
      const { version, versions } = doc;

      const buildingVersionIndex = versions.findIndex(item => item.status === 'building' && item.number >= version);

      if (buildingVersionIndex > -1) return { data: versions[buildingVersionIndex], index: buildingVersionIndex };

      const actualIndexVersion = versions.findIndex(item => item.number === version);

      if (actualIndexVersion > -1) return { data: versions[actualIndexVersion], index: actualIndexVersion };
    }
  }, [document]);

  const findDocument = async (id: number | string, version?: number | string) => {
    const { data: document }: any = await api.get(`/documents?id=${id}`);

    if (document[0]) {
      setDocument(document[0]);
      setDocumentData(document[0]);

      if (version) {
        setTargetVersion(version);
      } else {
        const currentVersion = handleBuildingVersion(document[0]);
        if (currentVersion)
          setTargetVersion(currentVersion.data.number);
      }
    }
  };

  const handleDocumentData = async (id: number | string) => {
    const { data: document }: any = await api.get(`/completed_documents?id=${id}`);

    if (document) {
      setDocumentData(document);
    }
  };

  const saveDocument = async (): Promise<IDocument | undefined> => {
    if (document) {
      let version = handleBuildingVersion();

      if (!version) return;

      const { data: currentVersion, index } = version;

      if (currentVersion) {
        const data = { ...document };

        if (currentVersion.status === 'building') {
          currentVersion.fields = fields;
          currentVersion.updated_at = new Date;

          data.versions[index] = currentVersion;
          data.updated_at = new Date;

          debugger;

          const { data: documentSaved }: { data: IDocument } = await api.put(`/documents/${document._id}`, data);
          console.log(documentSaved);
          setDocument(documentSaved);

        } else if (currentVersion.status === 'published') {
          const documentCopy = { ...document };
          const newVersion = documentCopy.version + 1;

          const { data: [documentData] }: { data: IDocument[] } = await api.get(`/documents?id=${document._id}`);

          documentData.updated_at = new Date;
          documentData.versions.push({
            fields,
            number: newVersion,
            created_at: new Date,
            updated_at: new Date,
            status: 'building'
          });

          const { data: documentSaved }: { data: IDocument } = await api.put(`/documents/${document._id}`, documentData);
          setDocument(documentSaved);
          setTargetVersion(newVersion);

          return documentSaved;
        }
      }
    }
  };

  const handleDocuments = async () => {
    const { data } = await api.get<IDocument[]>(`/documents`);

    setDocuments(data);
  };

  const updateDocumentName = (value: string) => {
    if (document) {
      let documentCopy = { ...document };

      documentCopy.name = value;

      setDocument(documentCopy);
    }
  };

  const toggleActiveDocument = (isActived: boolean) => {
    if (document) {
      let documentCopy = { ...document };

      documentCopy.active = isActived;

      setDocument(documentCopy);
    }
  };

  const fillDocumentFields = () => {
    if (document) {
      const { versions, version: actualVersionNumber } = document;

      // Se o parâmetro da versão por passado na url, carrega os campos da versão correspondente
      if (targetVersion) {
        const version = versions.find(item => item.number === targetVersion);

        if (version) {
          setCurrentVersion(version);
          setFields(version.fields);
          return;
        }
      }

      // Se não tiver parâmetro de versão, carrega os campos da versão com o status de 'building' que seja maior ou igual a versão atual do documento
      const buildingVersion = versions.find(item => item.status === 'building' && item.number >= actualVersionNumber);

      if (buildingVersion) {
        setCurrentVersion(buildingVersion);
        setFields(buildingVersion.fields);
        return;
      }

      // Em último caso, pega a versão atual do documento
      const actualVersion = versions.find(item => item.number === actualVersionNumber);

      if (actualVersion) {
        setCurrentVersion(actualVersion);
        setFields(actualVersion.fields);
        return;
      }
    }
  };

  const updateDocumentSize = (size: IElementSize, only?: "width" | "height") => {
    if (document) {
      let documentCopy = { ...document };

      if (only) {
        documentCopy.size[only] = isNaN(size[only]) ? 0 : size[only];
      } else {
        documentCopy.size = size;
      }

      setDocument(documentCopy);
    }
  };

  const publishDocument = async () => {
    debugger;
    if (document && targetVersion) {

      const { data: [documentData] }: { data: IDocument[] } = await api.get(`/documents?id=${document._id}`);

      documentData.version = parseInt(`${targetVersion}`);
      
      let versionKey = documentData.versions.findIndex(item => item.number === targetVersion);

      if (versionKey > -1) {
        documentData.versions[versionKey] = {
          ...documentData.versions[versionKey],
          created_at: new Date,
          updated_at: new Date,
          status: 'published'
        }
      }

      const documentSaved = await api.put(`/documents/${document._id}`, documentData);
      console.log(documentSaved);
    }
  };

  const createField = (type: FieldType) => {
    let field = FieldsDefaultProps[type];
    field = {
      ...field,
      position: {
        x: 0,
        y: scrollPosition ?? field.position.y
      },
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
        fieldsCopy[fieldKey].size[only] = isNaN(size[only]) ? 0 : size[only];
      } else {
        fieldsCopy[fieldKey].size = size;
      }

      setFields(fieldsCopy);
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

  const deleteVersion = async () => {
    if (currentVersion) {
      if (currentVersion.status !== 'building') throw { message: 'VERSION_IS_NOT_BUILDING' };

      const currentVersionIndex = document?.versions.findIndex(item => item.number === currentVersion.number);

      const documentCopy = { ...document };

      if (currentVersionIndex && currentVersionIndex > -1) {
        documentCopy.versions?.splice(currentVersionIndex, 1);

        const { data: documentSaved } = await api.put(`/documents/${documentCopy._id}`, documentCopy);

        setDocument(documentSaved);
      } else {
        throw { message: 'VERSION_NOT_FOUND' };
      }
    } else {
      throw { message: 'VERSION_NOT_FOUND' };
    }
  }

  return (
    <DocumentContext.Provider
      value={{
        document,
        documents,
        currentVersion,
        setDocument,
        fields,
        setFields,
        selectedField,
        setSelectedField,
        targetVersion,
        setTargetVersion,
        findDocument,
        saveDocument,
        handleDocumentData,
        documentData,
        setDocumentData,
        updateDocumentName,
        toggleActiveDocument,
        publishDocument,
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
        updateFieldOptionData,
        handleBuildingVersion,
        deleteVersion,
        scrollPosition,
        setScrollPosition
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => useContext(DocumentContext);