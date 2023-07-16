import { ModalOptions } from "../types/options";

export const defaultOptions: ModalOptions = {
  title: null,
  contents: null,
  confirmContents: null,
  cancelContents: null,
  subContents: null,
  transitionProperty: "",
  transitionDuration: 300,
  transitionTimingFunction: "",
  transitionDelay: 0,
  backCoverConfirm: null,
  backCoverColor: "",
  backCoverOpacity: 0.5,
  callback: () => { },
  middleware: () => { },
  autoClose: 0,
  payload: null,
  closeDelay: 0,
  position: "center",
  required: false
}