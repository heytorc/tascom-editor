import IField from "@/commons/interfaces/IField"

const text: IField = {
  _id: "",
  label: "Texto",
  placeholder: "Texto",
  type: "text",
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
  required: false
}

const date: IField = {
  _id: "",
  label: "Data",
  placeholder: "Data",
  type: "date",
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
  required: false
}

const number: IField = {
  _id: "",
  label: "Numero",
  placeholder: "Numero",
  type: "number",
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
  required: false
}

const textarea: IField = {
  _id: "",
  label: "Caixa de texto",
  placeholder: "Caixa de texto",
  type: "textarea",
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
  required: false
}

const label: IField = {
  _id: "",
  label: "Rótulo",
  placeholder: "Rótulo",
  type: "label",
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
  required: false
}

export default {
  text,
  date,
  number,
  textarea,
  label,
}