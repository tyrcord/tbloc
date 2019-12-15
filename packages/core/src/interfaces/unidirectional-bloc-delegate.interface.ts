import { UnidirectionalBloc } from '../core/unidirectional.bloc';
import {
  IUnidirectionalBlocTransitionEnd,
  IUnidirectionalBlocTransitionStart,
} from './unidirectional-bloc-transition.interface';

export interface IUnidirectionalBlocDelegate<S extends object = {}> {
  blocStateWillChange?: (
    bloc: UnidirectionalBloc<S>,
    unidirectionalBlocTransition: IUnidirectionalBlocTransitionStart<S>,
  ) => void;

  blocStateDidChange?: (
    bloc: UnidirectionalBloc<S>,
    unidirectionalBlocTransition: IUnidirectionalBlocTransitionEnd<S>,
  ) => void;

  blocDidCatchError?: (
    bloc: UnidirectionalBloc<S>,
    error: Error,
    state: S,
  ) => void;
}
