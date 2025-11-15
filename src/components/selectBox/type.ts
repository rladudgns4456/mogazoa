export interface SelectProps {
  placeHolder: string;
  width?: string;
}

export type Sorting = {
  id: number;
  label: string;
  value?: string;
};

export interface StyleProps {
  size?: string;
  selectBox?: string;
  optionBox?: string;
  optionItem?: string;
  button?: string;
  selected: string;
}
