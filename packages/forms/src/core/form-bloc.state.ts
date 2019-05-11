import { ValidationError } from 'yup';

export type FormFieldState<T = {}> = {
  value?: T;

  required: boolean;

  valid: boolean;

  disabled: boolean;

  errors: ValidationError[];
};

export type FormBlocStateFields = {
  [key: string]: FormFieldState;
};

export type FormBlocState = {
  fields: FormBlocStateFields;
  valid: boolean;
};
