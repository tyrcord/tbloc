import { IBidirectionalBlocDelegate, IBlocEvent } from '@tbloc/core';

import { FormBloc } from '../form.bloc';
import { IFormBlocState } from './form-bloc-state.interface';

export interface IFormBlocDelegate<
  M extends object,
  E extends IBlocEvent,
  S extends IFormBlocState
> extends IBidirectionalBlocDelegate<E, S> {
  blocDidValidateModel?: (bloc: FormBloc<M, E, S>, event: E, model: M) => void;
}
