import { IBidirectionalBlocDelegate } from '../../src/interfaces/bidirectional-bloc-delegate.interface';
import { PeopleBlocEvent } from './people-bloc-event.mock';
import { PeopleBlocState } from './people-bloc-state.mock';

export class BidirectionalPeopleBlocDelegate
  implements IBidirectionalBlocDelegate<PeopleBlocEvent, PeopleBlocState> {
  public blocStateWillChange(): void {}

  public blocStateDidChange(): void {}

  public blocDidCatchError(): void {}

  public blocWillProcessEvent(): void {}

  public blocDidProcessEvent(): void {}
}
