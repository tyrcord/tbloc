import { ContactFormBlocDelegate } from '../../src/contact/contact-form-bloc.delegate';
import { ContactFormBlocEvent } from '../../src/contact/contact-form-bloc.event';
import { ContactFormBlocModel } from '../../src/contact/contact-form-bloc.model';
import { ContactFormBloc } from '../../src/contact/contact-form.bloc';

export class MockContactFormBlocDelegate implements ContactFormBlocDelegate {
  public blocDidValidateModel(
    bloc: ContactFormBloc,
    event: ContactFormBlocEvent,
    model: ContactFormBlocModel,
  ) {}
}
