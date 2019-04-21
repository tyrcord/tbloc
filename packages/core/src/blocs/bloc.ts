import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UnidirectionalBlocDelegate } from '../types/unidirectional-bloc-delegate.type';

/**
 * Abstract class that
 */
export abstract class Bloc<T, K = {}> {
  public abstract delegate: any;

  protected stateController: BehaviorSubject<T>;

  public get currentState(): T {
    return this.stateController.getValue();
  }

  public get stream(): Observable<T> {
    return this.stateController.asObservable();
  }

  constructor(initialState: T) {
    this.stateController = new BehaviorSubject<T>(initialState);
  }

  public dispose(): void {
    this.stateController!.complete();
  }

  protected dispatchState(state: T) {
    this.stateController.next(state);
  }

  /**
   * Returns a boolean value that indicates whether a BloC's delegate implements
   * or inherits a method.
   *
   * @param name - the name of the delegate method
   *
   * @returns boolean
   */
  protected delegateRespondsToMethod(
    name: keyof UnidirectionalBlocDelegate<T> | K,
  ): boolean {
    const delegate = this.delegate;
    return delegate && typeof delegate[name] === 'function';
  }

  protected setState(candidateState: T) {
    const currentState = this.currentState;
    let responseFromDelegate: any;

    if (this.delegateRespondsToMethod('blocStateWillChange')) {
      try {
        // @ts-ignore -- `delegate` is safe here,
        // thanks to`delegateRespondsToMethod`
        responseFromDelegate = this.delegate.blocStateWillChange(this, {
          currentState,
          nextState: candidateState,
        });
      } catch (error) {
        responseFromDelegate = Promise.reject(error);
      }
    }

    const nextState = responseFromDelegate || candidateState;
    let promise: Promise<T>;

    if (nextState instanceof Promise) {
      promise = nextState;
    } else if (nextState instanceof Observable) {
      promise = nextState.pipe(take(1)).toPromise();
    } else if (nextState instanceof Error) {
      promise = Promise.reject(nextState);
    } else {
      promise = Promise.resolve(nextState);
    }

    promise
      .then(finalState => {
        this.dispatchState(finalState);

        if (this.delegateRespondsToMethod('blocStateDidChange')) {
          // @ts-ignore -- `delegate` is safe here,
          // thanks to`delegateRespondsToMethod`
          this.delegate.blocStateDidChange(this, {
            currentState: finalState,
            previousState: currentState,
          });
        }
      })
      .catch(this.handleError);
  }

  protected patchState = (candidateState: T) => {
    const currentState = this.currentState;

    this.setState({
      ...currentState,
      ...candidateState,
    });
  };

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
