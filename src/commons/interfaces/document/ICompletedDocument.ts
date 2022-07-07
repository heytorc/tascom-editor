import IDocument from "../IDocument";

export interface ICompletedDocumentField {
  field_id: string,
  value: string | number | boolean
}

export interface ICompletedDocument {
  _id: string,
  document_id: string | IDocument,
  system_id: string,
  company_id: string,
  version: number,
  fields: ICompletedDocumentField[],
  status: "canceled" | "filling" | "finished",
  created_by: string,
  created_at: Date,
  updated_by: string,
  updated_at: Date,
  canceled_by?: string,
  canceled_at?: Date,
  finished_by?: string,
  finished_at?: Date,
}