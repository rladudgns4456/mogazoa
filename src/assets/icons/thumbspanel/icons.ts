import IcFillTrue from "./ic_fill=True.svg";
import IcFillFalse from "./ic_fill=False.svg";

export type ThumbIconName = "ic_fill_True" | "ic_fill_False";

const map = {
  ic_fill_True: IcFillTrue,
  ic_fill_False: IcFillFalse,
} as const;

export function getThumbIcon(name: ThumbIconName) {
  return map[name];
}
