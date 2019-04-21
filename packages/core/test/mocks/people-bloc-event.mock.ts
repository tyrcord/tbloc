import { BlocEvent, BlocEventMetada } from "../../src/types/bloc-event.type";

export type PeopleBlocEventPayload = {
  firstname?: string;
  lastname?: string;
  age?: number;
};

export class PeopleBlocEvent implements BlocEvent<PeopleBlocEventPayload> {
  static Type = 'PeopleBlocEvent';

  error?: string | Error;

  meta?: BlocEventMetada;

  payload: PeopleBlocEventPayload;

  type: string = PeopleBlocEvent.Type;
}
