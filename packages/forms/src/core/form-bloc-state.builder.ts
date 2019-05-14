import { IBlocStateBuilder } from '@tbloc/core';
import { ValidationError } from 'yup';

import { FormBlocState, FormFieldState } from './form-bloc.state';

export class FormBlocStateBuilder<S extends FormBlocState>
  implements IBlocStateBuilder<S> {
  public buildDefault(): S {
    return {
      fields: {},
      valid: false,
    } as S;
  }

  public buildFormFieldState<U>(value?: U, required: boolean = false) {
    return {
      disabled: false,
      errors: [],
      required,
      valid: true,
      value,
    } as FormFieldState<U>;
  }

  public addErrorsToState(state: S, errors?: ValidationError[]) {
    if (errors) {
      for (const [index, error] of errors.entries()) {
        const path = error.path;
        const fieldState: FormFieldState = state.fields[path];

        if (fieldState) {
          fieldState.errors.push(error);
          fieldState.valid = false;
        } else {
          errors.splice(index, 1);
        }
      }
    }

    state.valid = !(errors && errors.length > 0);
  }
}
