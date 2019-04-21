import { BidirectionalBlocUpdateStrategy } from '../blocs/bidirectional.bloc';

export type BlocEventMetada = {
  updateStrategy?: keyof typeof BidirectionalBlocUpdateStrategy;
};

export type BlocEvent<T = {}, E = {}> = {
  type: string;
  error?: Error | string;
  meta?: E & BlocEventMetada;
  payload: T;
};
