import Button from "./components/ModalButton";
import CancelButton from "./components/ModalCancelButton";
import ConfirmButton from "./components/ModalConfirmButton";
import Content from "./components/ModalContent";
import setDispatcher from "./components/ModalDispatcher";
import setRegistrator from "./components/ModalRegistrator";
import SubButton from "./components/ModalSubButton";
import Title from "./components/ModalTitle";
import setUseIsOpen from "./hooks/useIsOpenModal";
import modalMetaList from "./modalMetaList";
import Manager from "./services/modalManager";
import {
  ModalConfirmType as ConfirmType,
  ModalCallback as Callback,
} from "./services/modalStateManager";
import {
  ModalOptions as Options,
  ModalComponent as Component,
  ModalComponentFiber as ComponentFiber,
} from "./types";
import setController from "./utils/setModalController";

export const defaultModalManager = new Manager(modalMetaList);
export const modalController = setController(defaultModalManager);
export const ModalProvider = setDispatcher(defaultModalManager);
export const Modal = setRegistrator(defaultModalManager);
export const ModalConfirmButton = ConfirmButton;
export const ModalCancelButton = CancelButton;
export const ModalSubButton = SubButton;
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
export type ModalMeta = ComponentFiber;

/**
 * @description
 * 모달을 추가하실려면 modalMetaList에 추가해주세요.
 */
defaultModalManager.setModalComponent(modalMetaList);
