import { IBlocEvent } from './bloc-event.interface';
import {
  IUnidirectionalBlocTransitionEnd,
  IUnidirectionalBlocTransitionStart,
} from './unidirectional-bloc-transition.interface';

export interface IBidirectionalBlocTransitionStart<
  E extends IBlocEvent,
  S extends object = {}
> extends IUnidirectionalBlocTransitionStart<S> {
  event: E;
}

export interface IBidirectionalBlocTransitionEnd<
  E extends IBlocEvent,
  S extends object = {}
> extends IUnidirectionalBlocTransitionEnd<S> {
  event: E;
}
