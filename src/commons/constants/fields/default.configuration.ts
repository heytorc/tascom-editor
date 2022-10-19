import IField from "@/commons/interfaces/IField";

// TODO - Adicionar tipo de campo Range

const text: IField = {
  _id: "",
  label: "Texto",
  placeholder: "Texto",
  type: "text",
  tag: "texto",
  position: {
    x: 0,
    y: 20
  },
  size: {
    width: 300,
    height: 80
  },
  styles: {
    fontSize: 14,
    color: "#fff",
    borderRadius: 5
  },
  required: false,
  useRichText: true,
}

const date: IField = {
  _id: "",
  label: "Data",
  placeholder: "Data",
  type: "date",
  tag: "date",
  position: {
    x: 0,
    y: 20
  },
  size: {
    width: 300,
    height: 80
  },
  styles: {
    fontSize: 14,
    color: "#fff",
    borderRadius: 5
  },
  required: false,
  useRichText: true,
}

const number: IField = {
  _id: "",
  label: "Numero",
  placeholder: "Numero",
  type: "number",
  tag: "number",
  position: {
    x: 0,
    y: 20
  },
  size: {
    width: 300,
    height: 80
  },
  styles: {
    fontSize: 14,
    color: "#fff",
    borderRadius: 5
  },
  required: false,
  useRichText: true,
}

const textarea: IField = {
  _id: "",
  label: "Caixa de texto",
  placeholder: "Caixa de texto",
  type: "textarea",
  tag: "textarea",
  position: {
    x: 0,
    y: 20
  },
  size: {
    width: 300,
    height: 125
  },
  styles: {
    fontSize: 14,
    color: "#fff",
    borderRadius: 5
  },
  required: false,
  useRichText: true,
}

const label: IField = {
  _id: "",
  label: "Rótulo",
  type: "label",
  tag: "label",
  position: {
    x: 0,
    y: 20
  },
  size: {
    width: 300,
    height: 40
  },
  styles: {
    fontSize: 14,
    color: "#fff",
    borderRadius: 5
  },
  required: false,
  useRichText: true,
}

const checkbox: IField = {
  _id: "",
  label: "Checkbox",
  type: "checkbox",
  tag: "checkbox",
  position: {
    x: 0,
    y: 20
  },
  size: {
    width: 270,
    height: 50
  },
  styles: {},
  required: false,
  useRichText: false,
  options: [
    { label: 'Opção 1', value: '1' },
    { label: 'Opção 2', value: '2' },
  ],
  orientation: 'row',
}

const radio: IField = {
  _id: "",
  label: "Radio",
  type: "radio",
  tag: "radio",
  position: {
    x: 0,
    y: 20
  },
  size: {
    width: 175,
    height: 50
  },
  styles: {},
  required: false,
  useRichText: false,
  options: [
    { label: 'Sim', value: 'sim' },
    { label: 'Não', value: 'nao' },
  ],
  orientation: 'row',
}

const yesOrNot: IField = {
  _id: "",
  label: "Pergunta?",
  type: "yesOrNot",
  tag: "yes-or-not",
  position: {
    x: 0,
    y: 20
  },
  size: {
    width: 155,
    height: 50
  },
  styles: {},
  required: false,
  useRichText: false,
}

const select: IField = {
  _id: "",
  label: "Select",
  type: "select",
  tag: "select",
  position: {
    x: 0,
    y: 20
  },
  size: {
    width: 300,
    height: 52
  },
  options: [
    { label: 'Opção 1', value: '1' },
    { label: 'Opção 2', value: '2' },
  ],
  styles: {},
  required: false,
  useRichText: false,
}

const range: IField = {
  _id: "",
  label: "Range",
  type: "range",
  tag: "range",
  position: {
    x: 0,
    y: 20
  },
  size: {
    width: 300,
    height: 52
  },
  options: [
    { label: 'Opção 1', value: '1' },
    { label: 'Opção 2', value: '2' },
  ],
  styles: {},
  required: false,
  useRichText: false,
  steps: 1,
  max: 10,
  min: 1
}

const image: IField = {
  _id: "",
  label: "Image",
  type: "image",
  tag: "image",
  src: "https://www.tascominformatica.com.br/img/logo-tascom2.png",
  position: {
    x: 0,
    y: 20
  },
  size: {
    width: 400,
    height: 200
  },
  styles: {},
  required: false,
  useRichText: false,
}

export default {
  text,
  date,
  number,
  textarea,
  label,
  radio,
  checkbox,
  select,
  yesOrNot,
  range,
  image
}