import { FormFieldState } from '../core/form-bloc.state';

export type ContactFormBlocState = {
  name: FormFieldState<string>;

  email: FormFieldState<string>;

  subject: FormFieldState<string>;

  message: FormFieldState<string>;
};
