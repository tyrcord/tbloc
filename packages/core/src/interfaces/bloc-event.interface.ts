import { BidirectionalBlocUpdateStrategy } from '../enums';

export interface IBlocEventMetada {
  updateStrategy?: BidirectionalBlocUpdateStrategy;
}

export interface IBlocEvent<P extends object = {}, M extends object = {}> {
  type: string;
  error?: Error | string;
  meta?: M & IBlocEventMetada;
  payload: P;
}
