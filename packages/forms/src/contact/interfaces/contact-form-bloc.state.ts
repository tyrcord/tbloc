import {
  IFormBlocState,
  IFormBlocStateFields,
  IFormFieldState,
} from '../../core/interfaces';

export interface IContactFormBlocStateFields extends IFormBlocStateFields {
  name: IFormFieldState<string>;
  email: IFormFieldState<string>;
  subject: IFormFieldState<string>;
  message: IFormFieldState<string>;
}

export interface IContactFormBlocState extends IFormBlocState {
  fields: IContactFormBlocStateFields;
  valid: boolean;
}
