import { IFormBlocDelegate } from '../../core/interfaces/form-bloc-delegate.interface';
import { ContactFormBlocEvent } from '../contact-form-bloc.event';
import { ContactFormBloc } from '../contact-form.bloc';
import { IContactFormBlocModel } from './contact-form-bloc.model';
import { IContactFormBlocState } from './contact-form-bloc.state';

export interface IContactFormBlocDelegate
  extends IFormBlocDelegate<
    IContactFormBlocModel,
    ContactFormBlocEvent,
    IContactFormBlocState
  > {
  blocDidValidateModel?: (
    bloc: ContactFormBloc,
    event: ContactFormBlocEvent,
    model: IContactFormBlocModel,
  ) => void;
}
