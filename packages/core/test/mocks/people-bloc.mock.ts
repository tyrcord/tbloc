import {
  BidirectionalBloc,
  BidirectionalBlocUpdateStrategy,
} from '../../src/blocs/bidirectional.bloc';
import { UnidirectionalBloc } from '../../src/blocs/unidirectional.bloc';
import { PeopleBlocEvent } from './people-bloc-event.mock';
import { PeopleBlocState } from './people-bloc-state.mock';

export class UnidirectionalPeopleBloc extends UnidirectionalBloc<
  PeopleBlocState
> {
  public put(state: PeopleBlocState) {
    this.setState(state);
  }

  public patch(state: PeopleBlocState) {
    this.patchState(state);
  }
}

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
