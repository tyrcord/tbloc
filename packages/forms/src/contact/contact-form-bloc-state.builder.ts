import { IBlocStateBuilder } from '@tbloc/core';

import { FormBlocStateBuilder } from '../core/form-bloc-state.builder';
import { IContactFormBlocModel } from './interfaces/contact-form-bloc.model';
import { IContactFormBlocState } from './interfaces/contact-form-bloc.state';

export class ContactFormBlocStateBuilder
  extends FormBlocStateBuilder<IContactFormBlocState>
  implements IBlocStateBuilder<IContactFormBlocState> {
  public buildDefaultState(): IContactFormBlocState {
    const state = super.buildDefaultState();

    state.fields = {
      email: this.buildFormFieldState<string>(void 0, true),
      message: this.buildFormFieldState<string>(void 0, true),
      name: this.buildFormFieldState<string>(void 0, true),
      subject: this.buildFormFieldState<string>(void 0),
    };

    return state;
  }

  public buildFromModel(
    model: IContactFormBlocModel,
    valid = false,
  ): IContactFormBlocState {
    const { email, message, name, subject } = model;

    return {
      fields: {
        email: this.buildFormFieldState<string>(email, true),
        message: this.buildFormFieldState<string>(message, true),
        name: this.buildFormFieldState<string>(name, true),
        subject: this.buildFormFieldState<string>(subject),
      },
      valid,
    };
  }
}
