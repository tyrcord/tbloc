import { UnidirectionalBloc } from '../core/unidirectional.bloc';
import {
  UnidirectionalBlocTransitionEnd,
  UnidirectionalBlocTransitionStart,
} from './unidirectional-bloc-transition.type';

export type UnidirectionalBlocDelegate<S extends object = {}> = {
  blocStateWillChange?: (
    bloc: UnidirectionalBloc<S>,
    unidirectionalBlocTransition: UnidirectionalBlocTransitionStart<S>,
  ) => void;

  blocStateDidChange?: (
    bloc: UnidirectionalBloc<S>,
    unidirectionalBlocTransition: UnidirectionalBlocTransitionEnd<S>,
  ) => void;

  blocDidCatchError?: (
    bloc: UnidirectionalBloc<S>,
    error: Error,
    state: S,
  ) => void;
};
