import { UnidirectionalBloc } from '../../src/core/unidirectional.bloc';
import { PeopleBlocState } from './people-bloc-state.mock';

export class UnidirectionalPeopleBloc extends UnidirectionalBloc<
  PeopleBlocState
> {
  public patch(state: PeopleBlocState) {
    this.patchState(state);
  }
}
