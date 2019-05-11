import { Observable } from 'rxjs';
import { BidirectionalBloc } from '../core/bidirectional.bloc';
import {
  BidirectionalBlocTransitionEnd,
  BidirectionalBlocTransitionStart,
} from './bidirectional-bloc-transition.type';
import { BlocEvent } from './bloc-event.type';

export type BidirectionalBlocDelegate<
  E extends BlocEvent,
  S extends object = {}
> = {
  blocStateWillChange?: (
    bloc: BidirectionalBloc<E, S>,
    bidirectionalBlocTransition: BidirectionalBlocTransitionStart<E, S>,
  ) => S | Observable<S> | Promise<S> | void | null;

  blocStateDidChange?: (
    bloc: BidirectionalBloc<E, S>,
    bidirectionalBlocTransition: BidirectionalBlocTransitionEnd<E, S>,
  ) => void;

  blocWillProcessEvent?: (
    bloc: BidirectionalBloc<E, S>,
    event: E,
    state: S,
  ) => void | E;

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
};
