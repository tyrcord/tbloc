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

  public buildFormFieldState<U>(value: any, required: boolean = false) {
    return {
      disabled: false,
      errors: [],
      required,
      valid: true,
      value,
    } as FormFieldState<U>;
  }

  public addErrorsToState(state: S, errors?: ValidationError[]) {
    state.valid = !!errors;

    if (errors) {
      for (const error of errors) {
        const path = error.path;
        const fieldState: FormFieldState = state.fields[path];

        fieldState.errors.push(error);
        fieldState.valid = false;
      }
    }
  }
}
