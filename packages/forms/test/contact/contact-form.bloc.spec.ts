import { expect } from 'chai';
import 'mocha';
import { skip, take } from 'rxjs/operators';
import { ValidationError } from 'yup';

import { ContactFormBlocStateBuilder } from '../../src/contact/contact-form-bloc-state.builder';
import { ContactFormBlocSchema } from '../../src/contact/contact-form-bloc.schema';
import { ContactFormBloc } from '../../src/contact/contact-form.bloc';

import {
  IContactFormBlocModel,
  IContactFormBlocState,
} from '../../src/contact';

// tslint:disable-next-line: no-big-function
describe('ContactFormBloc', () => {
  const stateBuilder = new ContactFormBlocStateBuilder();

  let bloc: ContactFormBloc;
  let contactModel: IContactFormBlocModel;
  let validState: IContactFormBlocState;

  beforeEach(() => {
    bloc = new ContactFormBloc();

    contactModel = {
      email: 'foo@tyrcord.com',
      message: 'hello world',
      name: 'foo',
    };

    validState = stateBuilder.buildFromModel(contactModel, true);
  });

  afterEach(() => {
    bloc.dispose();
  });

  describe('#constructor()', () => {
    it('should allow to create a new ContactFormBloc with an custom inital state', done => {
      validState.fields.subject.value = 'hello';
      bloc = new ContactFormBloc(validState);

      bloc.onData.pipe(take(1)).subscribe(state => {
        const {
          fields: { subject },
        } = state;

        expect(subject.value).to.equal('hello');
        expect(state.valid).to.equal(true);
        done();
      });
    });

    it('should allow to create a new ContactFormBloc with an custom schema', done => {
      bloc = new ContactFormBloc(
        void 0,
        ContactFormBlocSchema.defaultWithRequiredSubject(),
      );

      bloc.schemaValidator.validate(contactModel).catch(validationError => {
        expect(validationError.errors.length).to.equal(1);
        expect(validationError.inner.length).to.equal(0);
        expect(validationError.path).to.equal('subject');
        done();
      });
    });
  });

  describe('#onNameChange()', () => {
    it("should change the BloC's state when called", done => {
      bloc.onData.pipe(skip(1), take(1)).subscribe(({ fields: { name } }) => {
        expect(name.value).to.equal('foo');
        expect(name.valid).to.equal(true);
        expect(name.required).to.equal(true);
        done();
      });

      bloc.onNameChange('foo');
    });
  });

  describe('#onEmailChange()', () => {
    it('should dispatch a new state when the `email` value change', done => {
      bloc.onData.pipe(skip(1), take(1)).subscribe(({ fields: { email } }) => {
        expect(email.value).to.equal('qux@tyrcord.com');
        expect(email.valid).to.equal(true);
        expect(email.required).to.equal(true);
        done();
      });

      bloc.onEmailChange('qux@tyrcord.com');
    });
  });

  describe('#onSubjectChange()', () => {
    it('should dispatch a new state when the `subject` value change', done => {
      bloc.onData
        .pipe(skip(1), take(1))
        .subscribe(({ fields: { subject } }) => {
          expect(subject.value).to.equal('question');
          expect(subject.valid).to.equal(true);
          expect(subject.required).to.equal(false);
          done();
        });

      bloc.onSubjectChange('question');
    });
  });

  describe('#onMessageChange()', () => {
    it('should dispatch a new state when the `message` value change', done => {
      bloc.onData
        .pipe(skip(1), take(1))
        .subscribe(({ fields: { message } }) => {
          expect(message.value).to.equal('message');
          expect(message.valid).to.equal(true);
          expect(message.required).to.equal(true);
          done();
        });

      bloc.onMessageChange('message');
    });
  });

  describe('#schemaValidator', () => {
    it('should valid a model when all requirements are fulfilled', done => {
      bloc.schemaValidator.validate(contactModel).then(model => {
        expect(model.subject).to.equal(void 0);
        done();
      });
    });

    it('should invalid a model when some requirements are not fulfilled', done => {
      bloc = new ContactFormBloc(
        void 0,
        ContactFormBlocSchema.defaultWithRequiredSubject(),
      );

      bloc.schemaValidator
        .validate(contactModel)
        .catch((validationError: ValidationError) => {
          expect(validationError.errors.length).to.equal(1);
          expect(validationError.inner.length).to.equal(0);
          expect(validationError.path).to.equal('subject');
          done();
        });
    });
  });
});
