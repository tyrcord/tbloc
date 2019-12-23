import { Observable, of, Subject } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';

import { BlocStateBuilder } from '../types';
import { Bloc } from './bloc';

import { IBlocEvent, IBlocStateBuilder } from '../interfaces';

export abstract class BidirectionalBloc<
  E extends IBlocEvent,
  S extends object = {}
> extends Bloc<S> {
  protected internalEventController = new Subject<E>();
  protected externalEventController = new Subject<E>();
  protected errorController = new Subject<Error>();

  public get onEvent(): Observable<E> {
    return this.externalEventController.asObservable();
  }

  public get onError(): Observable<Error> {
    return this.errorController.asObservable();
  }

  constructor(
    initialState?: S,
    builder?: BlocStateBuilder<S> | IBlocStateBuilder<S>,
  ) {
    super(initialState, builder);

    this.internalEventController
      .pipe(
        concatMap((event: E) => {
          const currentState = this.currentState;

          if (event.error != null) {
            throw event.error;
          } else if (event.resetState) {
            return of(this.getInitialState());
          }

          this.externalEventController.next(event);

          return this.mapEventToState(event, currentState);
        }),
        catchError(this.handleError),
      )
      .subscribe((nextState: S) => {
        this.patchState(nextState);
      });
  }

  public dispatchEvent(event: E): void {
    if (!this.internalEventController.closed) {
      this.internalEventController.next(event);
    }
  }

  public reset(): void {
    this.dispatchEvent(({ resetState: true } as unknown) as E);
  }

  public dispose(): void {
    this.internalEventController.complete();
    this.externalEventController.complete();
    this.errorController.complete();
    super.dispose();
  }

  protected handleError = (error: Error | string): Observable<S> => {
    if (typeof error === 'string') {
      error = new Error(error);
    }

    this.errorController.next(error);

    return of(this.currentState);
  };

  protected abstract mapEventToState(event: E, currentState: S): Observable<S>;
}
