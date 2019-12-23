import { Observable, of } from 'rxjs';

import { BidirectionalBloc } from '../../src/core/bidirectional.bloc';
import { PeopleBlocEvent } from './people-bloc-event.mock';
import { PeopleBlocState } from './people-bloc-state.mock';

export class BidirectionalPeopleBloc extends BidirectionalBloc<
  PeopleBlocEvent,
  PeopleBlocState
> {
  protected mapEventToState(
    event: PeopleBlocEvent,
  ): Observable<PeopleBlocState> {
    return of(event.payload);
  }
}
