import { BlocStateBuilder } from '@tbloc/core';

import { FormBlocState, FormFieldState } from './form-bloc.state';

export class FormBlocStateBuilder<
  S extends FormBlocState
> extends BlocStateBuilder<S> {
  public buildFormFieldState<U>(value: any, required: boolean = false) {
    return {
      disabled: false,
      errors: [],
      required,
      valid: true,
      value,
    } as FormFieldState<U>;
  }
}
