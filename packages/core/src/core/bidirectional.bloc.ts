import { Observable, Subject, Subscription } from 'rxjs';

import { BidirectionalBlocDelegate } from '../types/bidirectional-bloc-delegate.type';
import { BlocEvent } from '../types/bloc-event.type';
import { Bloc, BlocStateBuilderFunc } from './bloc';
import { IBlocStateBuilder } from './bloc-state.builder';

export enum BidirectionalBlocUpdateStrategy {
  merge = 'merge',
  replace = 'replace',
}

export type MappedEventToStateTypes<S> =
  | S
  | Observable<S>
  | Promise<S>
  | void
  | null;

export abstract class BidirectionalBloc<
  E extends BlocEvent,
  S extends object = {},
  D extends BidirectionalBlocDelegate<E, S> = {}
> extends Bloc<S, D> {
  protected updateStrategy: keyof typeof BidirectionalBlocUpdateStrategy =
    BidirectionalBlocUpdateStrategy.merge;

  protected eventController: Subject<E> = new Subject<E>();

  protected eventSubscription: Subscription;

  constructor(
    initialState?: S,
    builder?: IBlocStateBuilder<S> | BlocStateBuilderFunc<S>,
  ) {
    super(initialState, builder);

    this.eventSubscription = this.eventController.subscribe((event: E) => {
      const currentState = this.currentState;
      let mappedState: MappedEventToStateTypes<S>;

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

  public dispatchEvent(event: E) {
    this.eventController.next(event);
  }

  public dispatchPayload(payload: any) {
    if (typeof this.eventFactory === 'function') {
      const event = this.eventFactory();
      event.payload = payload;

      this.dispatchEvent(event);
    } else {
      throw new Error(
        `the class "${this.constructor.name}" must implements the  method
        "eventFactory" in order to use the method dispatchPayload`,
      );
    }
  }

  public dispose(): void {
    super.dispose();
    this.eventController.complete();
    this.eventSubscription.unsubscribe();
  }

  protected updateState(
    nextState: S,
    updateStrategy: keyof typeof BidirectionalBlocUpdateStrategy,
  ) {
    if (updateStrategy === BidirectionalBlocUpdateStrategy.merge) {
      this.patchState(nextState);
    } else {
      this.setState(nextState);
    }
  }

  protected notifyDelegateBlocDidProcessEvent(event: E, nextState: S) {
    if (this.delegateRespondsToMethod('blocDidProcessEvent')) {
      // @ts-ignore -- `delegate` is safe here,
      // thanks to`delegateRespondsToMethod`
      this.delegate.blocDidProcessEvent(this, event, nextState);
    }
  }

  protected notifyDelegateBlocWillProcessEvent(event: E, currentState: S) {
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
  ): MappedEventToStateTypes<S>;

  protected eventFactory?(): E;
}
