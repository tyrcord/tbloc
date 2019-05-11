import { ObjectSchema, ValidationError } from 'yup';

import { FormBloc } from '../core/form.bloc';
import { ContactFormBlocStateBuilder } from './contact-form-bloc-state.builder';
import { ContactFormBlocEvent } from './contact-form-bloc.event';
import { ContactFormBlocModel } from './contact-form-bloc.model';
import { ContactFormBlocSchema } from './contact-form-bloc.schema';
import { ContactFormBlocState } from './contact-form-bloc.state';

export class ContactFormBloc extends FormBloc<
  ContactFormBlocModel,
  ContactFormBlocEvent,
  ContactFormBlocState
> {
  public schemaValidator: ObjectSchema<ContactFormBlocModel>;

  protected stateBuilder: ContactFormBlocStateBuilder;

  constructor(
    initialState?: ContactFormBlocState,
    schemaValidator?: ObjectSchema<ContactFormBlocModel>,
  ) {
    super(initialState, new ContactFormBlocStateBuilder());
    this.schemaValidator = schemaValidator || ContactFormBlocSchema.default();
  }

  public onNameChange(name: string) {
    this.dispatchPayload({ name });
  }

  public onEmailChange(email: string) {
    this.dispatchPayload({ email });
  }

  public onSubjectChange(subject: string) {
    this.dispatchPayload({ subject });
  }

  public onMessageChange(message: string) {
    this.dispatchPayload({ message });
  }

  protected eventFactory() {
    return new ContactFormBlocEvent();
  }

  protected mapEventToModel(
    event: ContactFormBlocEvent,
    currentModel: ContactFormBlocModel,
  ) {
    return {
      ...currentModel,
      ...event.payload,
    };
  }

  protected mapStateToModel(state: ContactFormBlocState): ContactFormBlocModel {
    const { email, message, name, subject } = state.fields;

    return {
      email: email.value,
      message: message.value,
      name: name.value,
      subject: subject.value,
    };
  }

  protected mapModelToState(
    model: ContactFormBlocModel,
    errors?: ValidationError[],
  ): ContactFormBlocState {
    const state = this.stateBuilder.buildFromModel(model);
    this.stateBuilder.addErrorsToState(state, errors);
    return state;
  }
}
