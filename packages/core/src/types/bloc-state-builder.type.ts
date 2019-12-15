import { IBlocStateBuilder } from '../interfaces';

export type BlocStateBuilderFunc<S extends object> = () => S;

export type BlocStateBuilderType<S extends object> =
  | IBlocStateBuilder<S>
  | BlocStateBuilderFunc<S>;
