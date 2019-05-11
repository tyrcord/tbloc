import { object, string, StringSchema } from 'yup';

import { ContactFormBlocModel } from './contact-form-bloc.model';

const defaultMaxNameLength: number = 256;

const defaultMaxSubjectLength: number = 256;

const defaultMaxMessageLength: number = 2048;

export abstract class ContactFormBlocSchema {
  public static get DefaultNameLength() {
    return defaultMaxNameLength;
  }

  public static get DefaultSubjectLength() {
    return defaultMaxSubjectLength;
  }

  public static get DefaultMessageLength() {
    return defaultMaxMessageLength;
  }

  public static default(
    nameLength = defaultMaxNameLength,
    messageLength = defaultMaxMessageLength,
    subjectLength = defaultMaxSubjectLength,
  ) {
    return this.buildShape(
      string().max(subjectLength),
      nameLength,
      messageLength,
    );
  }

  public static defaultWithRequiredSubject(
    nameLength = defaultMaxNameLength,
    messageLength = defaultMaxMessageLength,
    subjectLength = defaultMaxSubjectLength,
  ) {
    return this.buildShape(
      string()
        .required()
        .max(subjectLength),
      nameLength,
      messageLength,
    );
  }

  private static buildShape(
    subject: StringSchema,
    nameLength: number,
    messageLength: number,
  ) {
    return object<ContactFormBlocModel>().shape({
      email: string().email(),
      message: string()
        .max(messageLength)
        .required(),
      name: string()
        .required()
        .max(nameLength),
      subject,
    });
  }
}
