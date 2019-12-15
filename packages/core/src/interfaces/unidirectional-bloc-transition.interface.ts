export interface IUnidirectionalBlocTransitionStart<S = {}> {
  currentState: S;
  nextState: S;
}

export interface IUnidirectionalBlocTransitionEnd<S = {}> {
  currentState: S;
  previousState: S;
}
