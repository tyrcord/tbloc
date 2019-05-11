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
    return {
      email: state.email.value,
      message: state.message.value,
      name: state.name.value,
      subject: state.subject.value,
    };
  }

  protected mapModelToState(
    model: ContactFormBlocModel,
    errors?: ValidationError[],
  ): ContactFormBlocState {
    const builder = this.stateBuilder;
    const state = {
      email: builder.buildFormFieldState<string>(model.email, true),
      message: builder.buildFormFieldState<string>(model.message, true),
      name: builder.buildFormFieldState<string>(model.name, true),
      subject: builder.buildFormFieldState<string>(model.subject),
    };

    this.addErrorsToState(state, errors);

    return state;
  }
}
