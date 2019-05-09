import { Observable, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { BidirectionalBlocDelegate } from '../types/bidirectional-bloc-delegate.type';
import { BlocEvent } from '../types/bloc-event.type';
import { Bloc } from './bloc';

export enum BidirectionalBlocUpdateStrategy {
  merge = 'merge',
  replace = 'replace',
}

export abstract class BidirectionalBloc<
  E extends BlocEvent,
  S = {}
> extends Bloc<S, keyof BidirectionalBlocDelegate<E, S>> {
  public delegate: BidirectionalBlocDelegate<E, S>;

  protected updateStrategy: keyof typeof BidirectionalBlocUpdateStrategy =
    BidirectionalBlocUpdateStrategy.merge;

  protected eventController: Subject<E> = new Subject<E>();

  protected eventSubscription: Subscription;

  constructor(initialState: S) {
    super(initialState);

    this.eventSubscription = this.eventController.subscribe(
      (candidateEvent: E) => {
        const currentState = this.currentState || initialState;

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

  public dispose(): void {
    super.dispose();

    this.eventController!.complete();
    this.eventSubscription!.unsubscribe();
  }

  protected abstract mapEventToState(
    event: E,
    currentState: S,
  ): S | Observable<S> | Promise<S> | void | null;

  protected eventFactory?(): E;

}
