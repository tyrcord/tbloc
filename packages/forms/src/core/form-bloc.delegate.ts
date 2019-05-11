import { BidirectionalBlocDelegate, BlocEvent } from '@tbloc/core';

import { FormBlocState } from './form-bloc.state';
import { FormBloc } from './form.bloc';

export type FormBlocDelegateMethods<
  M extends object,
  E extends BlocEvent,
  S extends FormBlocState
> = {
  blocDidValidateModel: (bloc: FormBloc<M, E, S>, event: E, model: M) => void;
};

export type FormBlocDelegate<
  M extends object,
  E extends BlocEvent,
  S extends FormBlocState
> = BidirectionalBlocDelegate<E, S> & FormBlocDelegateMethods<M, E, S>;
