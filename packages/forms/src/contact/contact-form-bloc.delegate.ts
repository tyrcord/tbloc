import { BlocEvent, Omit } from '@tbloc/core';

import { ContactFormBlocModel } from '../contact/contact-form-bloc.model';
import { ContactFormBlocState } from '../contact/contact-form-bloc.state';
import { FormBlocDelegate } from '../core/form-bloc.delegate';
import { FormBlocState } from '../core/form-bloc.state';
import { ContactFormBlocEvent } from './contact-form-bloc.event';
import { ContactFormBloc } from './contact-form.bloc';

type ContactFormBlocDelegateBase<
  M extends object,
  E extends BlocEvent,
  S extends FormBlocState
> = Omit<FormBlocDelegate<M, E, S>, 'blocDidValidateModel'>;

export type ContactFormBlocDelegate = ContactFormBlocDelegateBase<
  ContactFormBlocModel,
  ContactFormBlocEvent,
  ContactFormBlocState
> & {
  blocDidValidateModel?: (
    bloc: ContactFormBloc,
    event: ContactFormBlocEvent,
    model: ContactFormBlocModel,
  ) => void;
};
