import { Observable, Subject, Subscription } from 'rxjs';

import { BidirectionalBlocUpdateStrategy } from '../enums';
import { Bloc } from './bloc';

import { IBlocEvent } from '../interfaces';
import { BlocStateBuilderType, IBidirectionalBlocDelegate } from '../types';

export abstract class BidirectionalBloc<
  E extends IBlocEvent,
  S extends object = {},
  D extends IBidirectionalBlocDelegate<E, S> = {}
> extends Bloc<S, D> {
  protected updateStrategy = BidirectionalBlocUpdateStrategy.merge;
  protected eventController = new Subject<E>();
  protected eventSubscription: Subscription;

  constructor(initialState?: S, builder?: BlocStateBuilderType<S>) {
    super(initialState, builder);

    this.eventSubscription = this.eventController.subscribe((event: E) => {
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
          this.notifyDelegateBlocDidProcessEvent(event, nextState);
        })
        .catch(this.handleError);
    });
  }

  public dispatchEvent(event: E): void {
    this.eventController.next(event);
  }

  public dispose(): void {
    super.dispose();
    this.eventController.complete();
    this.eventSubscription.unsubscribe();
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

  protected notifyDelegateBlocDidProcessEvent(event: E, nextState: S): void {
    if (this.delegateRespondsToMethod('blocDidProcessEvent')) {
      // @ts-ignore -- `delegate` is safe here,
      // thanks to`delegateRespondsToMethod`
      this.delegate.blocDidProcessEvent(this, event, nextState);
    }
  }

  protected notifyDelegateBlocWillProcessEvent(
    event: E,
    currentState: S,
  ): void {
    if (this.delegateRespondsToMethod('blocWillProcessEvent')) {
      // @ts-ignore -- `delegate` is safe here,
      // thanks to`delegateRespondsToMethod`
      this.delegate.blocWillProcessEvent(this, event, currentState);
    }
  }

  protected delegateRespondsToMethod(name: keyof D): boolean {
    return super.delegateRespondsToMethod(name);
  }

  protected noSupportForEvent(event: E): never {
    throw new Error(
      `bloc ${this.constructor.name} doesn't support bloc event type:
      ${event.type}`,
    );
  }

  protected abstract mapEventToState(
    event: E,
    currentState: S,
  ): Observable<S> | Promise<S> | S;
}
