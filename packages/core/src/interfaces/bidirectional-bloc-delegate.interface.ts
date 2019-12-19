import { BidirectionalBloc } from '../core';
import { IBlocDelegate } from './bloc-delegate.interface';
import { IBlocEvent } from './bloc-event.interface';

export interface IBidirectionalBlocDelegate<
  E extends IBlocEvent,
  S extends object = {}
> extends IBlocDelegate<S> {
  blocWillProcessEvent?: (
    bloc: BidirectionalBloc<E, S>,
    event: E,
    state: S,
  ) => void;

  blocDidProcessEvent?: (
    bloc: BidirectionalBloc<E, S>,
    event: E,
    state: S,
  ) => void;
}
