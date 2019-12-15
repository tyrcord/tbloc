export interface IBlocStateBuilder<S extends object = {}> {
  buildDefault(): S;
}
