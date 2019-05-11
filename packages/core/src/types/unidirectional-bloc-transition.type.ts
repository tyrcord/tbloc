export type UnidirectionalBlocTransitionStart<S = {}> = {
  currentState: S;
  nextState: S;
};

export type UnidirectionalBlocTransitionEnd<S = {}> = {
  currentState: S;
  previousState: S;
};
