import { Bloc } from './bloc';

import { IUnidirectionalBlocDelegate } from '../interfaces/unidirectional-bloc-delegate.interface';

export abstract class UnidirectionalBloc<S extends object = {}> extends Bloc<
  S,
  IUnidirectionalBlocDelegate
> {}
