import { Bloc } from './bloc';

import { UnidirectionalBlocDelegate } from '../types/unidirectional-bloc-delegate.type';

export abstract class UnidirectionalBloc<T = {}> extends Bloc<T> {
  public delegate: UnidirectionalBlocDelegate<T>;
}
