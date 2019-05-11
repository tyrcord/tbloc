import { FormBlocState, FormFieldState } from '../core/form-bloc.state';

export type ContactFormBlocStateFields = {
  name: FormFieldState<string>;

  email: FormFieldState<string>;

  subject: FormFieldState<string>;

  message: FormFieldState<string>;
};

export type ContactFormBlocState = FormBlocState & {
  fields: {
    name: FormFieldState<string>;

    email: FormFieldState<string>;

    subject: FormFieldState<string>;

    message: FormFieldState<string>;
  };

  valid: boolean;
};
