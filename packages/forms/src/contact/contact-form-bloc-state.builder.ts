import { IBlocStateBuilder } from '@tbloc/core';

import { FormBlocStateBuilder } from '../core/form-bloc-state.builder';
import { ContactFormBlocModel } from './contact-form-bloc.model';
import { ContactFormBlocState } from './contact-form-bloc.state';

export class ContactFormBlocStateBuilder
  extends FormBlocStateBuilder<ContactFormBlocState>
  implements IBlocStateBuilder<ContactFormBlocState> {
  public buildDefault(): ContactFormBlocState {
    const state = super.buildDefault();

    state.fields = {
      email: this.buildFormFieldState<string>(void 0, true),
      message: this.buildFormFieldState<string>(void 0, true),
      name: this.buildFormFieldState<string>(void 0, true),
      subject: this.buildFormFieldState<string>(void 0),
    };

    return state;
  }

  public buildFromModel(
    model: ContactFormBlocModel,
    valid = false,
  ): ContactFormBlocState {
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
