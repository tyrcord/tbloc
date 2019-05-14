import {
  BidirectionalBloc,
  BidirectionalBlocUpdateStrategy,
} from '../../src/core/bidirectional.bloc';
import { PeopleBlocEvent } from './people-bloc-event.mock';
import { PeopleBlocState } from './people-bloc-state.mock';

export class BidirectionalPeopleBloc extends BidirectionalBloc<
  PeopleBlocEvent,
  PeopleBlocState
> {
  public setUpdateStrategy(
    updateStrategy: keyof typeof BidirectionalBlocUpdateStrategy,
  ) {
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

  protected mapEventToState(event: PeopleBlocEvent): PeopleBlocState | void {
    if (event.type === PeopleBlocEvent.Type) {
      return event.payload;
    }
  }
}