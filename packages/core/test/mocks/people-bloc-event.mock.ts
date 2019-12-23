import { IBlocEvent } from '../../src/interfaces';

export type PeopleBlocEventPayload = {
  firstname?: string;
  lastname?: string;
  age?: number;
};

export class PeopleBlocEvent implements IBlocEvent<PeopleBlocEventPayload> {
  public static Type = 'PeopleBlocEvent';

  public static error() {
    return new PeopleBlocEvent(null, new Error('error'));
  }

  public type: string = PeopleBlocEvent.Type;

  constructor(
    public payload: PeopleBlocEventPayload,
    public error?: string | Error,
  ) {}
}
