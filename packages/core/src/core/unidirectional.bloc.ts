import { IBlocDelegate } from '../interfaces';
import { Bloc } from './bloc';

export abstract class UnidirectionalBloc<S extends object = {}> extends Bloc<
  S,
  IBlocDelegate
> {}
