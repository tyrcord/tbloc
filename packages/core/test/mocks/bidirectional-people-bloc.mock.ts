import { BidirectionalBloc } from '../../src/core/bidirectional.bloc';
import { BidirectionalBlocUpdateStrategy } from '../../src/enums';

import { PeopleBlocEvent } from './people-bloc-event.mock';
import { PeopleBlocState } from './people-bloc-state.mock';

export class BidirectionalPeopleBloc extends BidirectionalBloc<
  PeopleBlocEvent,
  PeopleBlocState
> {
  public setUpdateStrategy(updateStrategy: BidirectionalBlocUpdateStrategy) {
    return (this.updateStrategy = updateStrategy);
  }

  public getUpdateStrategy() {
    return this.updateStrategy;
  }

  public put(state: PeopleBlocState) {
    this.setState(state);
  }

  public patch(state: PeopleBlocState) {
    this.patchState(state);
  }

  protected mapEventToState(event: PeopleBlocEvent): PeopleBlocState {
    if (event.type === PeopleBlocEvent.Type) {
      return event.payload;
    }

    return null;
  }
}
