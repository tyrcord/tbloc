import { IBlocDelegate } from '../../src/interfaces';
import { PeopleBlocState } from './people-bloc-state.mock';

export class UnidirectionalPeopleBlocDelegate
  implements IBlocDelegate<PeopleBlocState> {
  public blocStateWillChange(): void {}

  public blocStateDidChange(): void {}

  public blocDidCatchError(): void {}
}
