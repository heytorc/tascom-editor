import { FieldType } from "../types/field.types"

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
  useRichText?: boolean
}