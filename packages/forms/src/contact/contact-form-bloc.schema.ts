import { object, string, StringSchema } from 'yup';

import { IContactFormBlocModel } from './interfaces';

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
      string().notRequired(),
      nameLength,
      messageLength,
      subjectLength,
    );
  }

  public static defaultWithRequiredSubject(
    nameLength = defaultMaxNameLength,
    messageLength = defaultMaxMessageLength,
    subjectLength = defaultMaxSubjectLength,
  ) {
    return this.buildShape(
      string().required(),
      nameLength,
      messageLength,
      subjectLength,
    );
  }

  private static buildShape(
    subject: StringSchema,
    nameLength: number,
    messageLength: number,
    subjectLength: number,
  ) {
    return object<IContactFormBlocModel>().shape({
      email: string()
        .required()
        .email(),
      message: string()
        .required()
        .max(messageLength),
      name: string()
        .required()
        .max(nameLength),
      subject: subject.max(subjectLength),
    });
  }
}
