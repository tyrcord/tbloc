import { ValidationError } from 'yup';

export interface IFormFieldState<T = {}> {
  value?: T;
  required: boolean;
  valid: boolean;
  disabled: boolean;
  errors: ValidationError[];
}

export interface IFormBlocStateFields {
  [key: string]: IFormFieldState;
}

export interface IFormBlocState {
  fields: IFormBlocStateFields;
  valid: boolean;
}
