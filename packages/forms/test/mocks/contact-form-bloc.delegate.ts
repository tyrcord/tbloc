import {
  ContactFormBloc,
  ContactFormBlocEvent,
  IContactFormBlocDelegate,
  IContactFormBlocModel,
} from '../../src/contact';

export class MockContactFormBlocDelegate implements IContactFormBlocDelegate {
  public blocDidValidateModel(
    bloc: ContactFormBloc,
    event: ContactFormBlocEvent,
    model: IContactFormBlocModel,
  ) {}
}
