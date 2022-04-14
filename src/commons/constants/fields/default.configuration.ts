import IField from "@/commons/interfaces/IField"

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
    width: 300,
    height: 50
  },
  styles: {},
  required: false,
  useRichText: false,
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
    width: 300,
    height: 95
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
    height: 80
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
  yesOrNot
}