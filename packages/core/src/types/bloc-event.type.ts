import { BidirectionalBlocUpdateStrategy } from '../core/bidirectional.bloc';

export type BlocEventMetada = {
  updateStrategy?: keyof typeof BidirectionalBlocUpdateStrategy;
};

export type BlocEvent<P extends object = {}, M extends object = {}> = {
  type: string;
  error?: Error | string;
  meta?: M & BlocEventMetada;
  payload: P;
};
