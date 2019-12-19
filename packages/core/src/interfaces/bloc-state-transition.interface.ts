export interface IBlocStateTransitionStart<S = {}> {
  currentState: S;
  nextState: S;
}

export interface IBlocStateTransitionEnd<S = {}> {
  currentState: S;
  previousState: S;
}
