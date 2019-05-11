export interface IBlocStateBuilder<S extends object = {}> {
  buildDefault(): S;
}

export class BlocStateBuilder<S extends object = {}>
  implements IBlocStateBuilder<S> {
  public buildDefault(): S {
    return {} as S;
  }
}
