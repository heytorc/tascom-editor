export type FieldType = "text" | "number" | "date" | "textarea" | "label";

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
    width?: number | string,
    height?: number | string,
  },
  styles?: React.CSSProperties,
  required?: boolean,
  isResizable?: boolean,
}

export default interface IField {
  _id: string,
  label: string,
  placeholder: string,
  type: FieldType,
  position: {
    x: number,
    y: number
  },
  size: {
    width: number | string,
    height: number | string,
  },
  styles: React.CSSProperties,
  required: boolean,
  isResizable?: boolean,
}