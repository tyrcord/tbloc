import { Observable } from 'rxjs';

import { BidirectionalBloc } from '../blocs/bidirectional.bloc';
import { BlocEvent } from './bloc-event.type';

import {
  BidirectionalBlocTransitionStart,
  BidirectionalBlocTransitionEnd
} from './bidirectional-bloc-transition.type';

export type BidirectionalBlocDelegate<T extends BlocEvent, K = {}> = {
  blocStateWillChange?: (
    bloc: BidirectionalBloc<T>,
    bidirectionalBlocTransition: BidirectionalBlocTransitionStart<T, K>
  ) => (
      K | Observable<K> | Promise<K> | void | null
    );

  blocStateDidChange?: (
    bloc: BidirectionalBloc<T>,
    bidirectionalBlocTransition: BidirectionalBlocTransitionEnd<T, K>
  ) => void;

  blocWillProcessEvent?: (bloc: BidirectionalBloc<T, K>, event: T, state: K) => void | T;

  blocDidProcessEvent?: (bloc: BidirectionalBloc<T>, event: T, state: K) => void;

  blocDidCatchError?: (bloc: BidirectionalBloc<T>, error: Error, state: K) => void;
};
