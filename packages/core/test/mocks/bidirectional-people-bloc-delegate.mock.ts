import { BidirectionalBlocDelegate } from '../../src/types/bidirectional-bloc-delegate.type';
import { PeopleBlocEvent } from './people-bloc-event.mock';
import { PeopleBlocState } from './people-bloc-state.mock';

export class BidirectionalPeopleBlocDelegate
  implements BidirectionalBlocDelegate<PeopleBlocEvent, PeopleBlocState> {
  public blocStateWillChange(): void {}

  public blocStateDidChange(): void {}

  public blocDidCatchError(): void {}

  public blocWillProcessEvent(): void {}

  public blocDidProcessEvent(): void {}
}
