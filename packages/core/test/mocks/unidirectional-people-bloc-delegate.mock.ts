import { IUnidirectionalBlocDelegate } from '../../src/types';
import { PeopleBlocState } from './people-bloc-state.mock';

export class UnidirectionalPeopleBlocDelegate
  implements IUnidirectionalBlocDelegate<PeopleBlocState> {
  public blocStateWillChange(): void {}

  public blocStateDidChange(): void {}

  public blocDidCatchError(): void {}
}
