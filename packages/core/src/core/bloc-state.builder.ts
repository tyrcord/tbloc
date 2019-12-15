import { IBlocStateBuilder } from '../interfaces';

export class BlocStateBuilder<S extends object = {}>
  implements IBlocStateBuilder<S> {
  public buildDefault(): S {
    return {} as S;
  }
}
