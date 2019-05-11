import { BlocEvent } from './bloc-event.type';
import {
  UnidirectionalBlocTransitionEnd,
  UnidirectionalBlocTransitionStart,
} from './unidirectional-bloc-transition.type';

export type BidirectionalBlocTransitionStart<
  E extends BlocEvent,
  S extends object = {}
> = {
  event: E;
} & UnidirectionalBlocTransitionStart<S>;

export type BidirectionalBlocTransitionEnd<
  E extends BlocEvent,
  S extends object = {}
> = {
  event: E;
} & UnidirectionalBlocTransitionEnd<S>;
