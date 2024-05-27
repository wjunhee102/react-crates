import { generateModal, modalCollection } from "@react-crates/modal";

export const {
  ModalProvider,
  modalCtrl,
  DynamicModal,
  useIsOpenModal
} = generateModal({ ...modalCollection });