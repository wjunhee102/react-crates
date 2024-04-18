import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type AsProp<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
};

export type PolymorphicComponentPropsWithoutRef<
  T extends ElementType
> = AsProp<T> & ComponentPropsWithoutRef<T>;