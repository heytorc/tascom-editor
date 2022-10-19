import React, { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { v1 as uuidv1 } from 'uuid';
import { cloneDeep } from 'lodash';

import useLocalStorage from "@/commons/hooks/useLocalStorage";

import IField, { IFieldOptions } from "@/commons/interfaces/IField";
import { FieldType, FieldOrientationType } from "@/commons/types/field.types";

import IPage from "@/commons/interfaces/IPage";
import IDocument, { IDocumentVersion } from "@/commons/interfaces/IDocument";
import { ICompletedDocument, ICompletedDocumentField } from "@/commons/interfaces/document/ICompletedDocument";

import FieldsDefaultProps from "@/commons/constants/fields/default.configuration";
import DocumentDefaultData from "@/commons/constants/documents/default.configuration"

import api from "@/commons/services/api";
import { useAuth } from "./auth.context";

// TODO - Alterar rotas para consumir dados do backend
// TODO - Atualizar a lista de versão quando o documento for publicado

interface IDocumentContext {
  fields: IField[],
  setFields: React.Dispatch<React.SetStateAction<IField[]>>,
  selectedField: IField | undefined,
  setSelectedField: React.Dispatch<React.SetStateAction<IField | undefined>>,
  document: IDocument | undefined,
  setDocument: React.Dispatch<React.SetStateAction<IDocument | undefined>>,
  documentData: ICompletedDocument | undefined,
  documentLastVersionData: IDocument | undefined,
  setDocumentLastVersionData: React.Dispatch<React.SetStateAction<IDocument | undefined>>,
  currentVersion: IDocumentVersion | undefined,
  setDocumentData: React.Dispatch<React.SetStateAction<any>>,
  targetVersion: number | string | undefined,
  setTargetVersion: React.Dispatch<React.SetStateAction<number | string | undefined>>,
  createDocument: (name: string) => Promise<IDocument | undefined>,
  findDocument: (id: string, version?: number | string) => void,
  saveDocument: () => Promise<IDocument | undefined>,
  handleDocumentData: (id: string) => void,
  updateDocumentName: (name: string) => void,
  toggleActiveDocument: (isActived: boolean) => void,
  toggleRequiredField: (isRequired: boolean) => void,
  publishDocument: () => void,
  createField: (type: FieldType) => void,
  deleteField: () => void,
  updateFieldLabel: (value: string) => void,
  updateFieldTag: (value: string) => void,
  updateFieldPlaceholder: (value: string) => void,
  updateFieldPosition: (position: IFieldPosition, only?: "x" | "y") => void,
  updateFieldSize: (size: IElementSize, only?: "width" | "height") => void,
  updateFieldStep: (step: number) => void,
  updateFieldMax: (max: number) => void,
  updateFieldMin: (min: number) => void,
  updateSourceField: (src: string | null) => void,
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
  createDocumentToFill: () => void,
  saveDocumentFill: (id: string, field?: ICompletedDocumentField, data?: ICompletedDocument) => void,
  finishDocument: () => void,
  quitDocument: () => void,
  cancelDocument: () => void,
  clearContext: () => void
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
  const [userStoraged, setUserStoraged] = useLocalStorage<string>("user", "");

  const { user } = useAuth();

  const [pages, setPages] = useState<IPage[]>();

  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [document, setDocument] = useState<IDocument>();
  const [documentLastVersionData, setDocumentLastVersionData] = useState<IDocument>();
  const [targetVersion, setTargetVersion] = useState<number | string>();

  const [currentVersion, setCurrentVersion] = useState<IDocumentVersion>();
  const [fields, setFields] = useState<IField[]>([]);
  const [selectedField, setSelectedField] = useState<IField>();

  // States to fill document
  const [documentData, setDocumentData] = useState<ICompletedDocument>();

  useEffect(() => {
    fillDocumentFields();
  }, [document, targetVersion]);

  const clearContext = () => {
    setDocuments([]);
    setDocument(undefined);
    setDocumentLastVersionData(undefined);
    setTargetVersion(undefined);
    setCurrentVersion(undefined);
    setFields([]);
    setSelectedField(undefined);
    setDocumentData(undefined);
  }

  const handleBuildingVersion = useCallback((currentDocument?: IDocument): ICurrentDocument | undefined => {
    const doc = document || currentDocument;

    if (doc) {
      const { version, versions } = doc;

      const buildingVersionIndex = versions.findIndex(item => item.status === 'building' && item.number >= version);

      if (buildingVersionIndex > -1) return { data: versions[buildingVersionIndex], index: buildingVersionIndex };

      const actualIndexVersion = versions.findIndex(item => item.number === version);

      if (actualIndexVersion > -1) return { data: versions[actualIndexVersion], index: actualIndexVersion };
    }
  }, []);

  const createDocument = async (name: string): Promise<IDocument | undefined> => {
    const { _id: userId, company_id = '62b1053fa702bc507415019e', system_id } = userStoraged ? JSON.parse(userStoraged) : user;

    const documentDefaultData = {
      ...DocumentDefaultData,
      name,
      company_id,
      system_id
    };

    try {

      const { data: document }: any = await api.post(`/documents/`, documentDefaultData);

      if (document) {
        setDocument(document);
        setDocumentLastVersionData(document);

        setTargetVersion(1);

        return document;
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const findDocument = async (id: string, version?: number | string) => {
    setDocument(undefined);
    setDocumentLastVersionData(undefined);
    setFields([]);

    const { data: document }: any = await api.get(`/documents/${id}`);

    if (document) {
      setDocument(document);
      setDocumentLastVersionData(document);

      if (version) {
        setTargetVersion(version);
      } else {
        const currentVersion = handleBuildingVersion(document);

        if (currentVersion) {
          setCurrentVersion(currentVersion.data);
          setTargetVersion(currentVersion.data.number);
        }
      }
    }
  };

  const handleDocumentData = async (id: string) => {
    const { data: document }: { data: ICompletedDocument } = await api.get(`/records/${id}`);

    if (document) {
      setTargetVersion(document.version);
      setDocumentData(document);
    }
  };

  const saveDocument = useCallback(async (): Promise<IDocument | undefined> => {
    if (document) {
      let version = handleBuildingVersion(document);

      if (!version) return;

      const { data: currentVersion, index } = version;

      if (currentVersion) {
        const data = { ...document };

        if (currentVersion.status === 'building') {
          currentVersion.fields = fields;
          currentVersion.updated_at = new Date;

          data.versions[index] = currentVersion;
          data.updated_at = new Date;

          const { data: documentSaved }: { data: IDocument } = await api.patch(`/documents/${document._id}`, data);
          
          setDocument(documentSaved);
          return documentSaved;

        } else if (currentVersion.status === 'published') {
          const documentCopy = { ...document };
          const newVersion = documentCopy.version + 1;

          const { data: documentData }: { data: IDocument } = await api.get(`/documents/${document._id}`);

          documentData.updated_at = new Date;
          documentData.versions.push({
            fields,
            number: newVersion,
            created_at: new Date,
            updated_at: new Date,
            status: 'building'
          });

          const { data: documentSaved }: { data: IDocument } = await api.patch(`/documents/${document._id}`, documentData);

          setDocument(documentSaved);
          setTargetVersion(newVersion);

          return documentSaved;
        }
      }
    }
  }, [document, fields]);

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

  const toggleRequiredField = (isRequired: boolean) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].required = isRequired;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
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
    if (document && targetVersion) {

      const { data: documentData }: { data: IDocument } = await api.get(`/documents/${document._id}`);

      const newVersion = parseInt(`${targetVersion}`);

      documentData.version = newVersion;

      let versionKey = documentData.versions.findIndex(item => item.number === newVersion);

      if (versionKey > -1) {
        documentData.versions[versionKey] = {
          ...documentData.versions[versionKey],
          created_at: new Date,
          updated_at: new Date,
          status: 'published'
        }
      }

      const documentSaved = await api.patch(`/documents/${document._id}`, documentData);
    }
  };

  const createField = (type: FieldType) => {
    setSelectedField(undefined);

    let newField = cloneDeep(FieldsDefaultProps[type]);

    const positions = fields.map(field => field.position);

    const maxY = !positions.length ? 0 : Math.max(...positions.map(position => position.y)) + 100;

    newField = {
      ...newField,
      position: {
        x: 0,
        y: maxY
      },
      _id: uuidv1()
    };

    const fieldsCopy = cloneDeep(fields);
    fieldsCopy.push(newField);

    setFields(fieldsCopy);
    setTimeout(() => setSelectedField(newField), 100);
  };

  const deleteField = () => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)

      fieldsCopy.splice(fieldKey, 1);

      setSelectedField(undefined);
      setFields([]);

      // Delay para atualização do estado
      setTimeout(() => setFields(fieldsCopy), 100)
    }
  };

  const updateFieldLabel = (value: string) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].label = value;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const updateFieldTag = (value: string) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].tag = value;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const updateFieldPlaceholder = (value: string) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].placeholder = value;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const updateFieldPosition = (position: IFieldPosition, only?: "x" | "y") => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

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
      const fieldsCopy = cloneDeep(fields);
      const selectedFieldCopy = cloneDeep(selectedField);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)

      if (only) {

        if (document && size[only] > document?.size[only]) return;

        fieldsCopy[fieldKey].size[only] = isNaN(size[only]) ? 0 : size[only];
        selectedFieldCopy.size[only] = fieldsCopy[fieldKey].size[only];
      } else {
        if (document && (size.width > document?.size.width || size.height > document?.size.height)) return;

        fieldsCopy[fieldKey].size = size;
        selectedFieldCopy.size = size;
      }

      setFields(fieldsCopy);
      setSelectedField(selectedFieldCopy)
    }
  };

  const updateFieldStep = (steps: number,) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)

      fieldsCopy[fieldKey].steps = steps;

      setFields(fieldsCopy);
    }
  };

  const updateFieldMax = (max: number) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)

      fieldsCopy[fieldKey].max = max;

      setFields(fieldsCopy);
    }
  };

  const updateFieldMin = (min: number) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)

      fieldsCopy[fieldKey].min = !isNaN(min) ? min : 1;

      setFields(fieldsCopy);
    }
  };

  const addFieldOptions = (option: IFieldOptions) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].options?.push(option);

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const updateFieldOptions = (options: IFieldOptions[]) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id)
      fieldsCopy[fieldKey].options = options;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const deleteFieldOption = (index: number) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

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
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id);
      fieldsCopy[fieldKey].orientation = orientation;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  };

  const updateFieldOptionData = (optionIndex: number, prop: 'value' | 'label', value: string) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id);
      let optionsCopy = fieldsCopy[fieldKey].options;

      if (optionsCopy) {
        optionsCopy[optionIndex][prop] = value;
      }

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  }

  const updateSourceField = (src: string | null) => {
    if (selectedField) {
      const fieldsCopy = cloneDeep(fields);

      const fieldKey = fieldsCopy.findIndex(item => item._id === selectedField._id);
      fieldsCopy[fieldKey].src = src ?? undefined;

      setSelectedField(fieldsCopy[fieldKey]);
      setFields(fieldsCopy);
    }
  }

  const deleteVersion = async () => {
    if (currentVersion) {
      if (currentVersion.status !== 'building') throw { message: 'VERSION_IS_NOT_BUILDING' };

      const currentVersionIndex = document?.versions.findIndex(item => item.number === currentVersion.number);

      const documentCopy = { ...document };

      if (typeof currentVersionIndex === 'number' && currentVersionIndex > -1) {
        documentCopy.versions?.splice(currentVersionIndex, 1);

        const { data: documentSaved } = await api.patch(`/documents/${documentCopy._id}`, documentCopy);

        setDocument(documentSaved);
      } else {
        throw { message: 'VERSION_NOT_FOUND' };
      }
    } else {
      throw { message: 'VERSION_NOT_FOUND' };
    }
  }

  // Document Fill
  const createDocumentToFill = async () => {
    if (!document) throw { message: 'DOCUMENT_NOT_FOUND' };

    const { _id, version } = document;

    const { _id: userId, company_id = '62b1053fa702bc507415019e', system_id } = userStoraged ? JSON.parse(userStoraged) : user;

    const { data: [fillingDocument] } = await api.get(`/records?document_id=${_id}&created_by=${userId}&company_id=${company_id}&status=filling`);


    if (fillingDocument) {
      setDocumentData(fillingDocument);
      return;
    }

    const { data: documentCreated }: { data: ICompletedDocument } = await api.post('/records', {
      document_id: _id,
      system_id,
      company_id,
      version,
      fields: [],
      status: "filling",
      created_by: userId,
    });

    setDocumentData(documentCreated);
  };

  const saveDocumentFill = async (id: string, field?: ICompletedDocumentField, data?: ICompletedDocument) => {
    let documentDataCopy = { ...documentData };

    if (field) {
      documentDataCopy.updated_at = new Date();

      const fieldIndex = documentDataCopy.fields?.findIndex(item => item.field_id === field.field_id) ?? -1;

      if (fieldIndex === -1) {
        documentDataCopy.fields?.push(field);
      } else if (documentDataCopy.fields) {
        documentDataCopy.fields[fieldIndex].value = field.value;
      }
    } else if (data) {
      documentDataCopy = {
        ...documentDataCopy,
        ...data,
        updated_at: new Date()
      }
    }

    // Se houver alterações entre os objetos de documentData (dados atuais no banco de dados) e a sua cópia
    // salva as modificações no banco de dados
    if (JSON.stringify(documentData) !== JSON.stringify(documentDataCopy)) {
      const { data: newDocumentData } = await api.patch(`/records/${id}`, documentDataCopy);
      // setDocumentData(newDocumentData);
    }
  };

  const finishDocument = async () => {
    const { data: newDocumentData } = await api.patch(`/records/${documentData?._id}`, {
      ...documentData,
      status: "finished",
      updated_at: new Date(),
      update_by: 1,
      finished_at: new Date(),
      finished_by: 1,
    });

    setDocumentData(newDocumentData);
  };

  const cancelDocument = async () => {
    const { data: newDocumentData } = await api.patch(`/records/${documentData?._id}`, {
      ...documentData,
      status: "canceled",
      updated_at: new Date(),
      update_by: 1,
      canceled_at: new Date(),
      canceled_by: 1,
    });

    setDocumentData(newDocumentData);
  };

  const quitDocument = async () => {
    await api.delete(`/records/${documentData?._id}`);

    setDocumentData(undefined);
  };

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
        createDocument,
        findDocument,
        saveDocument,
        handleDocumentData,
        documentData,
        setDocumentData,
        documentLastVersionData,
        setDocumentLastVersionData,
        updateDocumentName,
        toggleActiveDocument,
        toggleRequiredField,
        publishDocument,
        createField,
        deleteField,
        updateFieldLabel,
        updateFieldPlaceholder,
        updateFieldPosition,
        updateFieldSize,
        updateFieldStep,
        updateFieldMax,
        updateFieldMin,
        updateSourceField,
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
        createDocumentToFill,
        saveDocumentFill,
        finishDocument,
        quitDocument,
        cancelDocument,
        clearContext
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => useContext(DocumentContext);