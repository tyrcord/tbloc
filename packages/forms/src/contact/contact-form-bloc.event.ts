import { BlocEvent } from '@tbloc/core';

export type ContactFormBlocEventPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export class ContactFormBlocEvent
  implements BlocEvent<ContactFormBlocEventPayload> {
  public static Type = 'ContactFormBlocEvent';

  public get type() {
    return ContactFormBlocEvent.Type;
  }

  public payload: ContactFormBlocEventPayload;
}
