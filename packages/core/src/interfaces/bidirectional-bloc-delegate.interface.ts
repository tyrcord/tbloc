import { BidirectionalBloc } from '../core/bidirectional.bloc';
import { IBlocEvent } from './bloc-event.interface';

import {
  IBidirectionalBlocTransitionEnd,
  IBidirectionalBlocTransitionStart,
} from './bidirectional-bloc-transition.interface';

export interface IBidirectionalBlocDelegate<
  E extends IBlocEvent,
  S extends object = {}
> {
  blocStateWillChange?: (
    bloc: BidirectionalBloc<E, S>,
    bidirectionalBlocTransition: IBidirectionalBlocTransitionStart<E, S>,
  ) => void;

  blocStateDidChange?: (
    bloc: BidirectionalBloc<E, S>,
    bidirectionalBlocTransition: IBidirectionalBlocTransitionEnd<E, S>,
  ) => void;

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

  blocDidCatchError?: (
    bloc: BidirectionalBloc<E, S>,
    error: Error,
    state: S,
  ) => void;
}
