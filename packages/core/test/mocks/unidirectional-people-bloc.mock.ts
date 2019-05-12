import { UnidirectionalBloc } from '../../src/core/unidirectional.bloc';
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
