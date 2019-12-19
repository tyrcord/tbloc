import { Bloc } from '../core';

import {
  IBlocStateTransitionEnd,
  IBlocStateTransitionStart,
} from './bloc-state-transition.interface';

export interface IBlocDelegate<S extends object = {}> {
  blocStateWillChange?: (
    bloc: Bloc<S>,
    unidirectionalBlocTransition: IBlocStateTransitionStart<S>,
  ) => void;

  blocStateDidChange?: (
    bloc: Bloc<S>,
    unidirectionalBlocTransition: IBlocStateTransitionEnd<S>,
  ) => void;

  blocDidCatchError?: (bloc: Bloc<S>, error: Error, state: S) => void;
}
