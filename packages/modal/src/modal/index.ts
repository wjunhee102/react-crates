import Button from "./components/ModalButton";
import CancelButton from "./components/ModalCancelButton";
import ConfirmButton from "./components/ModalConfirmButton";
import Content from "./components/ModalContent";
import CustomButton from "./components/ModalCustomButton";
import setProvider from "./components/ModalProvider";
import setRegistrator from "./components/ModalRegistrator";
import Title from "./components/ModalTitle";
import setUseIsOpen from "./hooks/useIsOpenModal";
import modalMetaList from "./modalMetaList";
import Manager from "./services/modalManager";
import {
  ModalOptions as Options,
  ModalComponentSeed as ComponentSeed,
  ModalComponent as Component, ModalConfirmType as ConfirmType,
  ModalCallback as Callback,
} from "./types";
import setController from "./utils/setModalController";

export const defaultModalManager = new Manager(modalMetaList);
export const modalController = setController(defaultModalManager);
export const ModalProvider = setProvider(defaultModalManager);
export const Modal = setRegistrator(defaultModalManager);
export const ModalConfirmButton = ConfirmButton;
export const ModalCancelButton = CancelButton;
export const ModalCustomButton = CustomButton;
export const ModalButton = Button;
export const ModalContent = Content;
export const ModalTitle = Title;
export const useIsOpenModal = setUseIsOpen(defaultModalManager);
export const openModal = modalController.open;
export const closeModal = modalController.close;

export type ModalOptions = Options;
export type ModalConfirmType = ConfirmType;
export type ModalCallback = Callback;
export type ModalFC = Component;
export type ModalMeta = ComponentSeed;

/**
 * @description
 * 모달을 추가하실려면 modalMetaList에 추가해주세요.
 */
defaultModalManager.setModalComponent(modalMetaList);
