import { Bloc } from './bloc';

import { UnidirectionalBlocDelegate } from '../types/unidirectional-bloc-delegate.type';

export abstract class UnidirectionalBloc<S = {}> extends Bloc<S> {
  public delegate: UnidirectionalBlocDelegate<S>;
}
