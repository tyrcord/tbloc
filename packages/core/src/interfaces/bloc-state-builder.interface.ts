export interface IBlocStateBuilder<S extends object = {}> {
  buildDefaultState(): S;
}
