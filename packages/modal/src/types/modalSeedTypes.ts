import React from "react";
import { ModalComponent, ModalComponentProps } from "./modalComponentTypes";
import { ModalDispatchOptions, ModalOptions } from "./modalOptionsTypes";
import { DefaultModalPosition } from "./commonTypes";

export interface ModalComponentSeed<
  T extends any = any,
  P extends string = string
> {
  name: string;
  component: ModalComponent;
  defaultOptions?: ModalDispatchOptions<T, P>;
}

export interface ModalSeed<T extends ModalDispatchOptions = ModalOptions> {
  id: number;
  modalKey: string | null;
  name: string;
  component: ModalComponent<any>;
  options: T;
}

export type ModalMeta<T, P extends string = DefaultModalPosition> = {
  component: ModalComponent<T>;
  defaultOptions?: ModalDispatchOptions<T, P>;
};

export type ModalComponentSeedTable<
  T extends string = string,
  P extends string = string
> = {
    [name in T]: ModalMeta<any, P>;
  };
