import { UnidirectionalBlocDelegate } from '../../src/types/unidirectional-bloc-delegate.type';
import { PeopleBlocState } from './people-bloc-state.mock';

export class UnidirectionalPeopleBlocDelegate
  implements UnidirectionalBlocDelegate<PeopleBlocState> {
  public blocStateWillChange(): void {}

  public blocStateDidChange(): void {}

  public blocDidCatchError(): void {}
}
