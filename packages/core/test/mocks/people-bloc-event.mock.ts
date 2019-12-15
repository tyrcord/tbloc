import { IBlocEvent, IBlocEventMetada } from '../../src/interfaces';

export type PeopleBlocEventPayload = {
  firstname?: string;
  lastname?: string;
  age?: number;
};

export class PeopleBlocEvent implements IBlocEvent<PeopleBlocEventPayload> {
  public static Type = 'PeopleBlocEvent';
  public error?: string | Error;
  public meta?: IBlocEventMetada;
  public payload: PeopleBlocEventPayload;
  public type: string = PeopleBlocEvent.Type;
}
