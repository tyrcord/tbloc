import { Observable, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { BidirectionalBlocDelegate } from '../types/bidirectional-bloc-delegate.type';
import { BlocEvent } from '../types/bloc-event.type';
import { Bloc } from './bloc';
import { BlocStateBuilder } from './bloc-state.builder';

export enum BidirectionalBlocUpdateStrategy {
  merge = 'merge',
  replace = 'replace',
}

export abstract class BidirectionalBloc<
  E extends BlocEvent,
  S extends object = {},
  D extends BidirectionalBlocDelegate<E, S> = {}
> extends Bloc<S, D> {
  protected updateStrategy: keyof typeof BidirectionalBlocUpdateStrategy =
    BidirectionalBlocUpdateStrategy.merge;

  protected eventController: Subject<E> = new Subject<E>();

  protected eventSubscription: Subscription;

  constructor(initialState?: S, builder?: BlocStateBuilder<S>) {
    super(initialState, builder);

    this.eventSubscription = this.eventController.subscribe(
      (candidateEvent: E) => {
        const currentState = this.currentState;

        let mappedState: S | Observable<S> | Promise<S> | void | null;
        let delegateEvent: E | void;
        let promise: Promise<S>;

        if (this.delegateRespondsToMethod('blocWillProcessEvent')) {
          // @ts-ignore -- `delegate` is safe here,
          // thanks to`delegateRespondsToMethod`
          delegateEvent = this.delegate.blocWillProcessEvent(
            this,
            candidateEvent,
            currentState,
          );
        }

        const event = delegateEvent || candidateEvent;

        try {
          mappedState = this.mapEventToState(event, currentState);
        } catch (error) {
          mappedState = Promise.reject(error);
        }

        if (mappedState instanceof Promise) {
          promise = mappedState;
        } else if (mappedState instanceof Error) {
          promise = Promise.reject(mappedState);
        } else if (mappedState instanceof Observable) {
          promise = mappedState.pipe(take(1)).toPromise();
        } else if (mappedState === null || mappedState === void 0) {
          promise = Promise.resolve(currentState);
        } else {
          promise = Promise.resolve(mappedState);
        }

        promise
          .then((nextState: S) => {
            const { meta } = event;
            const updateStrategy =
              meta && meta.updateStrategy
                ? meta.updateStrategy
                : this.updateStrategy;

            if (updateStrategy === BidirectionalBlocUpdateStrategy.merge) {
              this.patchState(nextState);
            } else {
              this.setState(nextState);
            }

            if (this.delegateRespondsToMethod('blocDidProcessEvent')) {
              // @ts-ignore -- `delegate` is safe here,
              // thanks to`delegateRespondsToMethod`
              this.delegate.blocDidProcessEvent(this, event, nextState);
            }
          })
          .catch(this.handleError);
      },
    );
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

    this.eventController!.complete();
    this.eventSubscription!.unsubscribe();
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
  ): S | Observable<S> | Promise<S> | void | null;

  protected eventFactory?(): E;
}
