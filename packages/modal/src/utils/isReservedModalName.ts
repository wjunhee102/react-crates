import { RESERVED_MODAL_NAME } from "../contants";

export function isReservedModalName(name: string) {
  return !!RESERVED_MODAL_NAME[name as keyof typeof RESERVED_MODAL_NAME];
}
