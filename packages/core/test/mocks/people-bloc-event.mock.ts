import { BlocEvent, BlocEventMetada } from '../../src/types/bloc-event.type';

export type PeopleBlocEventPayload = {
  firstname?: string;
  lastname?: string;
  age?: number;
};

export class PeopleBlocEvent implements BlocEvent<PeopleBlocEventPayload> {
  public static Type = 'PeopleBlocEvent';

  public error?: string | Error;

  public meta?: BlocEventMetada;

  public payload: PeopleBlocEventPayload;

  public type: string = PeopleBlocEvent.Type;
}
