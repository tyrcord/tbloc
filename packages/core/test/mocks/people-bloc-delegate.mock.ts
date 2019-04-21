import { UnidirectionalBlocDelegate } from '../../src/types/unidirectional-bloc-delegate.type';
import { BidirectionalBlocDelegate } from '../../src/types/bidirectional-bloc-delegate.type';
import { PeopleBlocState } from './people-bloc-state.mock';
import { PeopleBlocEvent } from './people-bloc-event.mock';

export class UnidirectionalPeopleBlocDelegate
  implements UnidirectionalBlocDelegate<PeopleBlocState> {

  blocStateWillChange(): void { }

  blocStateDidChange(): void { }

  blocDidCatchError(): void { }
}

export class BidirectionalPeopleBlocDelegate
  implements BidirectionalBlocDelegate<PeopleBlocEvent, PeopleBlocState> {

  blocStateWillChange(): void { }

  blocStateDidChange(): void { }

  blocDidCatchError(): void { }

  blocWillProcessEvent(): void { }

  blocDidProcessEvent(): void { }
}
