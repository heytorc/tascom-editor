import { FieldType, FieldOrientationType } from "../types/field.types";

export interface IFieldOptions {
  label: string;
  value: string;
}

export interface IFieldProps {
  _id?: string,
  label?: string,
  placeholder?: string,
  type?: FieldType,
  position?: {
    x?: number,
    y?: number
  },
  size?: {
    width?: number,
    height?: number,
  },
  styles?: React.CSSProperties,
  required?: boolean,
  isResizable?: boolean,
}

export default interface IField {
  _id: string,
  label: string,
  placeholder?: string,
  src?: string,
  tag: string,
  type: FieldType,
  position: {
    x: number,
    y: number
  },
  size: {
    width: number,
    height: number,
  },
  styles: React.CSSProperties,
  required: boolean,
  isResizable?: boolean,
  useRichText?: boolean,
  options?: IFieldOptions[],
  orientation?: FieldOrientationType,
  steps?: number,
  max?: number,
  min?: number,
  table: {
    rows: number,
    columns: number,
    height: number
  }
}