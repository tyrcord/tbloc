import { Observable } from 'rxjs';
import { UnidirectionalBloc } from '../blocs/unidirectional.bloc';
import {
  UnidirectionalBlocTransitionEnd,
  UnidirectionalBlocTransitionStart,
} from './unidirectional-bloc-transition.type';

export type UnidirectionalBlocDelegate<T = {}> = {
  blocStateWillChange?: (
    bloc: UnidirectionalBloc<T>,
    unidirectionalBlocTransition: UnidirectionalBlocTransitionStart<T>,
  ) => T | Observable<T> | Promise<T> | void | null;

  blocStateDidChange?: (
    bloc: UnidirectionalBloc<T>,
    unidirectionalBlocTransition: UnidirectionalBlocTransitionEnd<T>,
  ) => void;

  blocDidCatchError?: (
    bloc: UnidirectionalBloc<T>,
    error: Error,
    state: T,
  ) => void;
};
