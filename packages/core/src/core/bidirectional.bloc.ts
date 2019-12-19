import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { BidirectionalBlocUpdateStrategy } from '../enums';
import { BlocStateBuilder } from '../types';
import { Bloc } from './bloc';

import {
  IBidirectionalBlocDelegate,
  IBlocEvent,
  IBlocStateBuilder,
} from '../interfaces';

export abstract class BidirectionalBloc<
  E extends IBlocEvent,
  S extends object = {},
  D extends IBidirectionalBlocDelegate<E, S> = {}
> extends Bloc<S, D> {
  protected updateStrategy = BidirectionalBlocUpdateStrategy.merge;
  protected eventController = new Subject<E>();

  constructor(
    initialState?: S,
    builder?: BlocStateBuilder<S> | IBlocStateBuilder<S>,
  ) {
    super(initialState, builder);

    this.eventController.subscribe((event: E) => {
      let mappedState: Observable<S> | Promise<S> | S;
      const currentState = this.currentState;

      this.notifyDelegateBlocWillProcessEvent(event, currentState);

      try {
        mappedState = this.mapEventToState(event, currentState);
      } catch (error) {
        mappedState = Promise.reject(error);
      }

      this.promisifyState(mappedState)
        .then((nextState: S) => {
          const { meta } = event;
          const updateStrategy =
            meta && meta.updateStrategy
              ? meta.updateStrategy
              : this.updateStrategy;

          this.updateState(nextState, updateStrategy);
          this.notifyDelegateBlocDidProcessEvent(event, this.currentState);
        })
        .catch(this.handleError);
    });
  }

  public dispatchEvent(event: E): void {
    this.eventController.next(event);
  }

  public dispose(): void {
    this.eventController.complete();
    super.dispose();
  }

  protected promisifyState(nextState: any): Promise<S> {
    if (nextState instanceof Promise) {
      return nextState;
    } else if (nextState instanceof Error) {
      return Promise.reject(nextState);
    } else if (nextState instanceof Observable) {
      return nextState.pipe(take(1)).toPromise();
    }

    return Promise.resolve(nextState ?? this.currentState);
  }

  protected updateState(
    nextState: S,
    updateStrategy: BidirectionalBlocUpdateStrategy,
  ): void {
    if (updateStrategy === BidirectionalBlocUpdateStrategy.merge) {
      this.patchState(nextState);
    } else {
      this.setState(nextState);
    }
  }

  protected notifyDelegateBlocWillProcessEvent(event: E, state: S): void {
    if (this.delegateRespondsToMethod('blocWillProcessEvent')) {
      // @ts-ignore -- `delegate` is safe here,
      // thanks to`delegateRespondsToMethod`
      this.delegate.blocWillProcessEvent(this, event, state);
    }
  }

  protected notifyDelegateBlocDidProcessEvent(event: E, state: S): void {
    if (this.delegateRespondsToMethod('blocDidProcessEvent')) {
      // @ts-ignore -- `delegate` is safe here,
      // thanks to`delegateRespondsToMethod`
      this.delegate.blocDidProcessEvent(this, event, state);
    }
  }

  protected delegateRespondsToMethod(name: keyof D): boolean {
    return super.delegateRespondsToMethod(name);
  }

  protected abstract mapEventToState(
    event: E,
    currentState: S,
  ): Observable<S> | Promise<S> | S;
}
