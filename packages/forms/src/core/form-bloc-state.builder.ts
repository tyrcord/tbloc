import { IBlocStateBuilder } from '@tbloc/core';
import { ValidationError } from 'yup';

import {
  IFormBlocState,
  IFormFieldState,
} from './interfaces/form-bloc-state.interface';

export class FormBlocStateBuilder<S extends IFormBlocState>
  implements IBlocStateBuilder<S> {
  public buildDefault(): S {
    return {
      fields: {},
      valid: false,
    } as S;
  }

  public buildFormFieldState<U>(
    value?: U,
    required = false,
  ): IFormFieldState<U> {
    return {
      disabled: false,
      errors: [],
      required,
      valid: true,
      value,
    };
  }

  public addErrorsToState(state: S, errors?: ValidationError[]): void {
    if (errors) {
      for (const [index, error] of errors.entries()) {
        const path = error.path;
        const fieldState: IFormFieldState = state.fields[path];

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
