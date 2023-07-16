import { defaultOptions } from "../contants/defaultOptions";
import { ModalTransactionState } from "../types/common";
import { ModalComponent } from "../types/component";
import { ModalDefaultOptions, ModalOptions } from "../types/options";
import Modal from "./Modal";

export type ModalManagerListener = (modalStack: Modal[], transactionState: ModalTransactionState) => void;

interface ModalMeta {
  component: ModalComponent;
  options: ModalOptions;
}

interface ModalMetaProps {
  name: string;
  component: ModalComponent;
  options: ModalDefaultOptions;
}

type ModalMetaMap = Map<string, ModalMeta>;

/**
 * 모달 시드 저장
 * 모달 생성 및 삭제
 * 
 */
export class ModalManager {
  private currentId: number = 0;
  private callCount: number = 0;
  private transactionState: ModalTransactionState = "idle";
  private modalMetaMap: ModalMetaMap = new Map();
  private modalStack: Modal[] = [];
  private listeners: ModalManagerListener[] = [];
  private defaultOptions: ModalOptions = defaultOptions;

  constructor(
    baseModalMetaProps: ModalMetaProps[] = [],
    defaultOptionsProps: ModalDefaultOptions = {}
  ) {
    this.setModalMetaMap.bind(this);
    this.deleteModalMetaMap.bind(this);

    this.defaultOptions = { ...this.defaultOptions, ...defaultOptionsProps };
    baseModalMetaProps.forEach(this.setModalMetaMap);
  }

  private setModalMetaMap(modalMetaProps: ModalMetaProps) {
    const { name, component, options } = modalMetaProps;

    if (component === undefined) {
      return;
    }

    const currentModalMeta = this.modalMetaMap.get(name);

    if (
      currentModalMeta &&
      currentModalMeta.options.required
    ) {
      return;
    }

    const modalMeta: ModalMeta = {
      component,
      options: {
        ...this.defaultOptions,
        ...options
      }
    };

    this.modalMetaMap.set(name, modalMeta);
  }

  private deleteModalMetaMap(key: string) {
    const modalMeta = this.modalMetaMap.get(key);

    if (!modalMeta) {
      return;
    }

    const { options: required } = modalMeta;

    if (required) {
      return;
    }

    this.modalMetaMap.delete(key);
  }

  add(modalMetaProps: ModalMetaProps | ModalMetaProps[]) {
    if (Array.isArray(modalMetaProps)) {
      modalMetaProps.forEach(this.setModalMetaMap);

      return this;
    }

    this.setModalMetaMap(modalMetaProps);

    return this;
  }

  remove(key: string | string[]) {
    if (Array.isArray(key)) {
      key.forEach(this.deleteModalMetaMap);

      return this;
    }

    this.deleteModalMetaMap(key);

    return this;
  }

  /**
   * modal meta를 불러옵니다.
   * @param key 
   * @param optionsProps 
   */
  read(key: string) {
    const modalMeta = this.modalMetaMap.get(key);

    if (!modalMeta) {
      return null;
    }

    return modalMeta;
  }

  /**
   * 
   * @returns 
   */
  push(): number {
    return 1;
  }

  /**
   * 현재 가장 마지막에 존재하는 modal id를 불러온다.
   */
  pop(modalId?: number) {

  }

}