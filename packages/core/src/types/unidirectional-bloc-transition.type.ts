export type UnidirectionalBlocTransitionStart<T = {}> = {
  currentState: T;
  nextState: T;
};

export type UnidirectionalBlocTransitionEnd<T = {}> = {
  currentState: T;
  previousState: T;
};
