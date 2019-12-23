import { SubxList } from '@tutils/subx';
import { BehaviorSubject, Observable } from 'rxjs';

import { IBlocStateBuilder } from '../interfaces';
import { BlocStateBuilder } from '../types';

function blocStateBuilder<S>(): S {
  return {} as S;
}

export abstract class Bloc<S extends object = {}> {
  protected stateController: BehaviorSubject<S>;
  protected subxList = new SubxList();

  public get currentState(): S {
    return this.stateController.getValue();
  }

  public get onData(): Observable<S> {
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
    this.subxList.unsubscribeAll();
    this.stateController.complete();
  }

  protected getInitialState(): S {
    if (!this.initialState) {
      if (this.stateBuilder) {
        if (typeof this.stateBuilder === 'function') {
          return this.stateBuilder();
        }
        return this.stateBuilder.buildDefaultState();
      }

      return blocStateBuilder();
    }

    return this.initialState;
  }

  protected patchState = (candidateState: Partial<S>): void => {
    this.setState({
      ...this.currentState,
      ...candidateState,
    });
  };

  protected setState(candidateState: S): void {
    this.dispatchState(candidateState);
  }

  protected dispatchState(state: S): void {
    if (!this.stateController.closed) {
      this.stateController.next(state);
    }
  }
}
