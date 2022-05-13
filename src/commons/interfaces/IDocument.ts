import IField from "./IField";

export interface IDocumentVersion {
  number: number,
  created_at: Date,
  updated_at: Date,
  fields: IField[],
  status: 'published' | 'building' | 'canceled'
}

export default interface IDocument {
  _id: string,
  name: string,
  system_id: number,
  company_id: number,
  active: boolean,
  created_at: Date,
  updated_at: Date,
  version: number,
  pages: number,
  size: {
    width: number,
    height: number
  },
  versions: IDocumentVersion[]
};