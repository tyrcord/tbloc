import { FormBlocStateBuilder } from '../core/form-bloc-state.builder';
import { ContactFormBlocModel } from './contact-form-bloc.model';
import { ContactFormBlocState } from './contact-form-bloc.state';

export class ContactFormBlocStateBuilder extends FormBlocStateBuilder<
  ContactFormBlocState
> {
  public default(): ContactFormBlocState {
    return {
      email: this.buildFormFieldState<string>(null, true),
      message: this.buildFormFieldState<string>(null, true),
      name: this.buildFormFieldState<string>(null, true),
      subject: this.buildFormFieldState<string>(null),
    };
  }

  public buildFromModel(model: ContactFormBlocModel) {
    const { email, message, name, subject } = model;
    return {
      email: this.buildFormFieldState<string>(email, true),
      message: this.buildFormFieldState<string>(message, true),
      name: this.buildFormFieldState<string>(name, true),
      subject: this.buildFormFieldState<string>(subject),
    };
  }
}
