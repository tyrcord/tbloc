import { ObjectSchema, ValidationError } from 'yup';

import { FormBloc } from '../core/form.bloc';
import { ContactFormBlocStateBuilder } from './contact-form-bloc-state.builder';
import { ContactFormBlocEvent } from './contact-form-bloc.event';
import { ContactFormBlocSchema } from './contact-form-bloc.schema';

import {
  IContactFormBlocEventPayload,
  IContactFormBlocModel,
  IContactFormBlocState,
} from './interfaces';

export class ContactFormBloc extends FormBloc<
  IContactFormBlocModel,
  ContactFormBlocEvent,
  IContactFormBlocState
> {
  public schemaValidator: ObjectSchema<IContactFormBlocModel>;
  protected stateBuilder: ContactFormBlocStateBuilder;

  constructor(
    initialState?: IContactFormBlocState,
    schemaValidator?: ObjectSchema<IContactFormBlocModel>,
  ) {
    super(initialState, new ContactFormBlocStateBuilder());
    this.schemaValidator = schemaValidator || ContactFormBlocSchema.default();
  }

  public onNameChange(name: string): void {
    this.dispatchPayload({ name });
  }

  public onEmailChange(email: string): void {
    this.dispatchPayload({ email });
  }

  public onSubjectChange(subject: string): void {
    this.dispatchPayload({ subject });
  }

  public onMessageChange(message: string): void {
    this.dispatchPayload({ message });
  }

  public dispatchPayload(payload: IContactFormBlocEventPayload): void {
    this.dispatchEvent(new ContactFormBlocEvent(payload));
  }

  protected mapEventToModel(
    event: ContactFormBlocEvent,
    currentModel: IContactFormBlocModel,
  ): IContactFormBlocModel {
    return {
      ...currentModel,
      ...event.payload,
    };
  }

  protected mapStateToModel(
    state: IContactFormBlocState,
  ): IContactFormBlocModel {
    const { email, message, name, subject } = state.fields;

    return {
      email: email.value,
      message: message.value,
      name: name.value,
      subject: subject.value,
    };
  }

  protected mapModelToState(
    model: IContactFormBlocModel,
    errors?: ValidationError[],
  ): IContactFormBlocState {
    const state = this.stateBuilder.buildFromModel(model);
    this.stateBuilder.addErrorsToState(state, errors);
    return state;
  }
}
