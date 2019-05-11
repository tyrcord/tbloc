import { ValidationError } from 'yup';

export type FormFieldState<T = {}> = {
  value?: T;

  required: boolean;

  valid: boolean;

  disabled: boolean;

  errors: ValidationError[];
};

export type FormBlocState = {
  [index: string]: FormFieldState;
};
