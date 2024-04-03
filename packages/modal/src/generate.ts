import ModalButton from "./components/ModalButton";
import ModalCancelButton from "./components/ModalCancelButton";
import ModalConfirmButton from "./components/ModalConfirmButton";
import ModalContents from "./components/ModalContents";
import ModalCustomButton from "./components/ModalCustomButton";
import setModalProvider from "./components/ModalProvider";
import setModalRegistrator from "./components/ModalRegistrator";
import ModalSubContents from "./components/ModalSubContents";
import ModalSubTitle from "./components/ModalSubTitle";
import ModalTitle from "./components/ModalTitle";
import setUseIsOpenModal from "./hooks/useIsOpenModal";
import ModalManager from "./services/modalManager";
import { Controller, ModalComponent, ModalComponentSeedTable, ModalController, ModalDispatchOptions, ModalManagerOptionsProps, ModalPositionTable } from "./types"

export function generateModalController<T extends ModalComponentSeedTable, P extends ModalPositionTable>(modalManager: ModalManager, modalComponentSeedEntries: [string, {
  component: ModalComponent;
  defaultOptions?: ModalDispatchOptions<any, string> | undefined;
}][]): ModalController<T, P> {
  return {
    open: modalManager.open,
    close: modalManager.close,
    edit: modalManager.edit,
    remove: modalManager.remove,
    ...modalComponentSeedEntries.reduce((controller, modalEntry) => {
      const modalName = modalEntry[0] as Extract<keyof T, string>;

      controller[modalName] = (options: T[typeof modalName]["defaultOptions"] extends { payload: infer R }
        ? ModalDispatchOptions<R, Extract<keyof P, string>>
        : ModalDispatchOptions<any, Extract<keyof P, string>>) => modalManager.open(modalName, options);

      return controller;
    }, {} as Controller<T, P>)
  }
}

type ExtendModalComponentSeedTable<K extends ModalComponentSeedTable, T extends Partial<ModalComponentSeedTable>> = {
  [P in keyof K | keyof T]: P extends keyof T ? T[P] : P extends keyof K ? K[P] : never;
};


/**
 * setAddModalOptions는 addModalOptions 함수에 의존성을 주입하기 위한 클로저를 생성합니다.
 * 이 패턴을 통해 기존 ModalManager 인스턴스에 새로운 모달 옵션과 컴포넌트를 추가할 수 있습니다.
 * 반환된 함수인 addModalOptions는 ModalManager의 기능을 새로운 모달 컴포넌트와 옵션으로 확장하는 데 사용할 수 있습니다.
 * 
 * @param {ModalManager} modalManager - 새로운 모달 옵션과 컴포넌트가 추가될 ModalManager 인스턴스입니다.
 * @returns 모달 컴포넌트 시드 테이블과 모달 매니저 옵션을 받아 ModalManager 인스턴스를 확장하는 함수를 반환합니다.
 */
function setExtendModalSuite<K extends ModalComponentSeedTable, J extends ModalPositionTable>(modalManager: ModalManager) {
  return function extendModalSuite<T extends ModalComponentSeedTable, P extends ModalPositionTable>(modalComponentSeedTable: T = {} as T,
    options: ModalManagerOptionsProps<P> = {}): ModalController<ExtendModalComponentSeedTable<K, T>, J & P> {
    const modalComponentSeedEntries = Object.entries(modalComponentSeedTable);
    const modalComponentSeedList = modalComponentSeedEntries.map(([name, properties]) => ({ name, ...properties }));

    modalManager.setModalComponent(modalComponentSeedList);
    modalManager.setModalOptions(options);

    return generateModalController<ExtendModalComponentSeedTable<K, T>, J & P>(modalManager, modalComponentSeedEntries);
  }
}


export function generateModalSuite<T extends ModalComponentSeedTable, P extends ModalPositionTable>(
  modalComponentSeedTable: T = {} as T,
  options: ModalManagerOptionsProps<P> = {}
) {
  const modalComponentSeedEntries = Object.entries(modalComponentSeedTable);
  const modalComponentSeedList = modalComponentSeedEntries.map(([name, properties]) => ({ name, ...properties }));

  const modalManager = new ModalManager(modalComponentSeedList, options);

  return {
    Modal: {
      Provider: setModalProvider(modalManager),
      Registrator: setModalRegistrator(modalManager),
      Button: ModalButton,
      ConfirmButton: ModalConfirmButton,
      CancelButton: ModalCancelButton,
      CustomButton: ModalCustomButton,
      Contents: ModalContents,
      SubContents: ModalSubContents,
      Title: ModalTitle,
      SubTitle: ModalSubTitle,
    },
    useIsOpenModal: setUseIsOpenModal(modalManager),
    modalCtrl: generateModalController<T, P>(modalManager, modalComponentSeedEntries),
    extendModalSuite: setExtendModalSuite<T, P>(modalManager)
  }
}

const { modalCtrl, extendModalSuite } = generateModalSuite({
  test: {
    component: () => null,
    defaultOptions: {
      payload: "바보"
    }
  },
  바보: {
    component: () => null,
    defaultOptions: {}
  }
}, {
  position: {
    test: {
      open: {},
      active: {},
      close: {}
    }
  }
});

const ctrl = extendModalSuite({
  test: {
    component: () => null,
    defaultOptions: {
      payload: 0
    }
  }
}, {
  position: {
    test: {
      open: {},
      active: {},
      close: {}
    }
  }
})

modalCtrl.test({
  payload: "s",
  position: "center-backCover-bottom",
});

ctrl.test({
  payload: 1,
  position: "test"
})
modalCtrl.바보({ payload: "ㄴㅁㅇㅁㄴㅇ", position: "backCover-backCover-backCover" });