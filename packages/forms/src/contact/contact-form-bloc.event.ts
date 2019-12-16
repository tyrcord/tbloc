import { IBlocEvent } from '@tbloc/core';

import { IContactFormBlocEventPayload } from './interfaces';

export class ContactFormBlocEvent
  implements IBlocEvent<IContactFormBlocEventPayload> {
  public static Type = 'ContactFormBlocEvent';

  public get type() {
    return ContactFormBlocEvent.Type;
  }

  constructor(public payload: IContactFormBlocEventPayload = {}) {}
}
