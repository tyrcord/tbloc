import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { BlocStateBuilderType, IUnidirectionalBlocDelegate } from '../types';
import { BlocStateBuilder } from './bloc-state.builder';

/**
 * Abstract class that
 */
export abstract class Bloc<
  S extends object = {},
  D extends IUnidirectionalBlocDelegate = {}
> {
  public delegate: D;
  protected stateController: BehaviorSubject<S>;
  protected stateBuilder: BlocStateBuilderType<S>;

  public get currentState(): S {
    return this.stateController.getValue();
  }

  public get stream(): Observable<S> {
    return this.stateController.asObservable();
  }

  constructor(protected initialState?: S, builder?: BlocStateBuilderType<S>) {
    builder = builder ? builder : new BlocStateBuilder<S>();

    if (!initialState) {
      if (typeof builder === 'function') {
        initialState = builder();
      } else {
        initialState = builder.buildDefault();
      }
    }

    this.stateBuilder = builder;
    this.stateController = new BehaviorSubject<S>(initialState);
  }

  public dispose(): void {
    this.stateController.complete();
  }

  /**
   * Returns a boolean value that indicates whether a BloC's delegate implements
   * or inherits a method.
   *
   * @param name - the name of the delegate method
   *
   * @returns boolean
   */
  protected delegateRespondsToMethod(name: keyof D): boolean {
    const delegate = this.delegate;
    return delegate && typeof delegate[name] === 'function';
  }

  protected patchState = (candidateState: Partial<S>): void => {
    this.setState({
      ...this.currentState,
      ...candidateState,
    });
  };

  protected setState(nextState: S): void {
    const currentState = this.currentState;

    this.notifyDelegateBlocStateWillChange(currentState, nextState);

    this.promisifyState(nextState)
      .then((finalState: S) => {
        this.dispatchState(finalState);
        this.notifyDelegateBlocStateDidChange(finalState, currentState);
      })
      .catch(this.handleError);
  }

  protected promisifyState(nextState: any): Promise<S> {
    let promise: Promise<S>;

    if (nextState instanceof Promise) {
      promise = nextState;
    } else if (nextState instanceof Error) {
      promise = Promise.reject(nextState);
    } else if (nextState instanceof Observable) {
      promise = nextState.pipe(take(1)).toPromise();
    } else {
      promise = Promise.resolve(nextState ?? this.currentState);
    }

    return promise;
  }

  protected dispatchState(state: S): void {
    this.stateController.next(state);
  }

  protected notifyDelegateBlocStateWillChange(
    currentState: S,
    nextState: S,
  ): void {
    if (this.delegateRespondsToMethod('blocStateWillChange')) {
      // @ts-ignore -- `delegate` is safe here,
      // thanks to`delegateRespondsToMethod`
      this.delegate.blocStateWillChange(this, {
        currentState,
        nextState,
      });
    }
  }

  protected notifyDelegateBlocStateDidChange(
    currentState: S,
    previousState: S,
  ): void {
    if (this.delegateRespondsToMethod('blocStateDidChange')) {
      // @ts-ignore -- `delegate` is safe here,
      // thanks to`delegateRespondsToMethod`
      this.delegate.blocStateDidChange(this, {
        currentState,
        previousState,
      });
    }
  }

  protected handleError = (error: Error) => {
    if (this.delegateRespondsToMethod('blocDidCatchError')) {
      if (!(error instanceof Error)) {
        error = new Error(error);
      }

      // @ts-ignore -- `delegate` is safe here,
      // thanks to`delegateRespondsToMethod`
      this.delegate.blocDidCatchError(this, error, this.currentState);
    }
  };
}
