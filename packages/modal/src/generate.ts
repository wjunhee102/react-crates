import { ModalManager } from "./services";
import { setModalProvider, setDynamicModal } from "./components";
import setUseIsOpenModal from "./hooks/useIsOpenModal";
import type {
  Controller,
  DefaultModalPosition,
  ModalCallback,
  ModalComponent,
  ModalComponentSeedTable,
  ModalController,
  ModalDispatchOptions,
  ModalManagerOptionsProps,
  ModalPositionTable,
} from "./types";

function generateModalController<
  T extends ModalComponentSeedTable,
  P extends ModalPositionTable
>(
  modalManager: ModalManager,
  modalComponentSeedEntries: [
    string,
    {
      component: ModalComponent;
      defaultOptions?: ModalDispatchOptions<any, string> | undefined;
    }
  ][]
): ModalController<T, P> {
  return {
    open: modalManager.open,
    remove: modalManager.remove,
    action: modalManager.action,
    ...modalComponentSeedEntries.reduce((controller, modalEntry) => {
      const modalName = modalEntry[0] as Extract<keyof T, string>;

      controller[modalName] = (
        options?:
          | (T[typeof modalName]["defaultOptions"] extends {
            payload: infer R;
          }
            ? Omit<
              ModalDispatchOptions<R, Extract<keyof P, string>>,
              "required"
            >
            : Omit<
              ModalDispatchOptions<any, Extract<keyof P, string>>,
              "required"
            >)
          | ModalCallback
          | string
      ) => modalManager.open(modalName, options);

      return controller;
    }, {} as Controller<T, P>),
  };
}

type ExtractPositionType<T extends ModalManagerOptionsProps> = T extends {
  position?: infer R;
}
  ? R
  : ModalPositionTable<DefaultModalPosition>;

export function generateModal<
  T extends ModalComponentSeedTable<
    string,
    Extract<keyof ExtractPositionType<P>, string>
  >,
  P extends ModalManagerOptionsProps = ModalManagerOptionsProps<
    ModalPositionTable<DefaultModalPosition>
  >
>(modalComponentSeedTable: T = {} as T, options: P = {} as P) {
  const modalComponentSeedEntries = Object.entries(modalComponentSeedTable);
  const modalComponentSeedList = modalComponentSeedEntries.map(
    ([name, properties]) => ({ name, ...properties })
  );

  const modalManager = new ModalManager(modalComponentSeedList, options);

  return {
    modalManager,
    modalCtrl: generateModalController<T, ExtractPositionType<P>>(
      modalManager,
      modalComponentSeedEntries
    ),
    ModalProvider: setModalProvider(modalManager),
    DynamicModal:
      setDynamicModal<Extract<keyof ExtractPositionType<P>, string>>(
        modalManager
      ),
    useIsOpenModal: setUseIsOpenModal(modalManager),
  };
}