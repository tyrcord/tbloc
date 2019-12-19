import { BehaviorSubject, Observable } from 'rxjs';

import { IBlocDelegate, IBlocStateBuilder } from '../interfaces';
import { BlocStateBuilder } from '../types';

function blocStateBuilder<S>(): S {
  return {} as S;
}

/**
 * Abstract class that
 */
export abstract class Bloc<
  S extends object = {},
  D extends IBlocDelegate = {}
> {
  public delegate: D;
  protected stateController: BehaviorSubject<S>;

  protected buildDefaultState?: () => S;

  public get currentState(): S {
    return this.stateController.getValue();
  }

  public get stream(): Observable<S> {
    return this.stateController.asObservable();
  }

  constructor(
    protected initialState?: S,
    protected stateBuilder?: BlocStateBuilder<S> | IBlocStateBuilder<S>,
  ) {
    this.stateController = new BehaviorSubject<S>(this.getInitialState());
  }

  public reset(): void {
    this.setState(this.getInitialState());
  }

  public dispose(): void {
    this.stateController.complete();
  }

  protected getInitialState(): S {
    if (!this.initialState) {
      if (this.stateBuilder) {
        if (typeof this.stateBuilder === 'function') {
          return this.stateBuilder();
        }
        return this.stateBuilder.buildDefaultState();
      } else if (typeof this.buildDefaultState === 'function') {
        return this.buildDefaultState();
      }

      return blocStateBuilder();
    }

    return this.initialState;
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

  protected setState(candidateState: S): void {
    const currentState = this.currentState;
    let nextState = this.notifyDelegateBlocStateWillChange(
      currentState,
      candidateState,
    );

    nextState = nextState ?? candidateState;
    this.dispatchState(nextState);
    this.notifyDelegateBlocStateDidChange(nextState, currentState);
  }

  protected dispatchState(state: S): void {
    this.stateController.next(state);
  }

  protected notifyDelegateBlocStateWillChange(
    currentState: S,
    nextState: S,
  ): S {
    if (this.delegateRespondsToMethod('blocStateWillChange')) {
      // @ts-ignore -- `delegate` is safe here,
      // thanks to`delegateRespondsToMethod`
      this.delegate.blocStateWillChange(this, {
        currentState,
        nextState,
      });
    }

    return null;
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

  protected handleError = (error: Error | string) => {
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
