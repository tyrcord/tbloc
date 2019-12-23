export interface IBlocEvent<P extends object = {}> {
  type?: string;
  error?: Error | string;
  payload?: P;
  resetState?: boolean;
}
