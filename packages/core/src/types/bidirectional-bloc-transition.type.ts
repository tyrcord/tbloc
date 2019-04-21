import { BlocEvent } from './bloc-event.type';
import {
  UnidirectionalBlocTransitionEnd,
  UnidirectionalBlocTransitionStart,
} from './unidirectional-bloc-transition.type';

export type BidirectionalBlocTransitionStart<T extends BlocEvent, K = {}> = {
  event: T;
} & UnidirectionalBlocTransitionStart<K>;

export type BidirectionalBlocTransitionEnd<T extends BlocEvent, K = {}> = {
  event: T;
} & UnidirectionalBlocTransitionEnd<K>;
