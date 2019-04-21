import { UnidirectionalBloc } from '../../src/blocs/unidirectional.bloc';
import { PeopleBlocState } from './people-bloc-state.mock';
import { PeopleBlocEvent } from './people-bloc-event.mock';

import {
  BidirectionalBloc, BidirectionalBlocUpdateStrategy
} from '../../src/blocs/bidirectional.bloc';

export class UnidirectionalPeopleBloc extends UnidirectionalBloc<PeopleBlocState> {
  public put(state: PeopleBlocState) {
    this.setState(state);
  }

  public patch(state: PeopleBlocState) {
    this.patchState(state);
  }
}

export class BidirectionalPeopleBloc
  extends BidirectionalBloc<PeopleBlocEvent, PeopleBlocState> {

  protected mapEventToState(event: PeopleBlocEvent): PeopleBlocState | void {
    if (event.type === PeopleBlocEvent.Type) {
      return event.payload;
    }
  }

  public setUpdateStrategy(updateStrategy: keyof typeof BidirectionalBlocUpdateStrategy) {
    return this.updateStrategy = updateStrategy;
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
}
