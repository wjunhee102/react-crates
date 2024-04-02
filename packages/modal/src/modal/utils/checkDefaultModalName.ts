import { MODAL_NAME } from "../contants";

export function checkDefaultModalName(name: string) {
  return !!MODAL_NAME[name as keyof typeof MODAL_NAME];
}
