export class BlocStateBuilder<S extends object = {}> {
  public default(): S {
    return {} as S;
  }
}
