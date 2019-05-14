import { expect } from 'chai';
import 'mocha';
import { ObjectSchema, ValidationError } from 'yup';

import { ContactFormBlocModel } from '../../src/contact/contact-form-bloc.model';
import { ContactFormBlocSchema } from '../../src/contact/contact-form-bloc.schema';

const SHOULD_HAVE_DEFAULT_VALUE = 'should have a default value';

describe('ContactFormBlocSchema', () => {
  let schema: ObjectSchema<ContactFormBlocModel>;
  let contactModel: ContactFormBlocModel;
  let contactModelWithSubject: ContactFormBlocModel;

  beforeEach(() => {
    schema = ContactFormBlocSchema.default();
    contactModel = {
      email: 'foo@tyrcord.com',
      message: 'hello world',
      name: 'foo',
    };

    contactModelWithSubject = {
      ...contactModel,
      subject: 'hello',
    };
  });

  describe('#DefaultNameLength', () => {
    it(SHOULD_HAVE_DEFAULT_VALUE, () => {
      expect(typeof ContactFormBlocSchema.DefaultNameLength).to.equal('number');
      expect(ContactFormBlocSchema.DefaultNameLength).to.equal(256);
    });
  });

  describe('#DefaultSubjectLength', () => {
    it(SHOULD_HAVE_DEFAULT_VALUE, () => {
      expect(typeof ContactFormBlocSchema.DefaultSubjectLength).to.equal(
        'number',
      );
      expect(ContactFormBlocSchema.DefaultSubjectLength).to.equal(256);
    });
  });

  describe('#DefaultMessageLength', () => {
    it(SHOULD_HAVE_DEFAULT_VALUE, () => {
      expect(typeof ContactFormBlocSchema.DefaultMessageLength).to.equal(
        'number',
      );
      expect(ContactFormBlocSchema.DefaultMessageLength).to.equal(2048);
    });
  });

  describe('#default()', () => {
    beforeEach(() => {
      schema = ContactFormBlocSchema.default();
    });

    it('should return a default contact schema', () => {
      expect(typeof schema).to.equal('object');
    });

    it('should allow to specify the name length', done => {
      schema = ContactFormBlocSchema.default(2);

      schema
        .validate(contactModel)
        .catch((validationError: ValidationError) => {
          expect(validationError.errors.length).to.equal(1);
          expect(validationError.inner.length).to.equal(0);
          expect(validationError.path).to.equal('name');
          done();
        });
    });

    it('should allow to specify the message length', done => {
      schema = ContactFormBlocSchema.default(
        ContactFormBlocSchema.DefaultNameLength,
        2,
      );

      schema
        .validate(contactModel)
        .catch((validationError: ValidationError) => {
          expect(validationError.errors.length).to.equal(1);
          expect(validationError.inner.length).to.equal(0);
          expect(validationError.path).to.equal('message');
          done();
        });
    });

    it('should allow to specify the subject length', done => {
      schema = ContactFormBlocSchema.default(
        ContactFormBlocSchema.DefaultNameLength,
        ContactFormBlocSchema.DefaultMessageLength,
        2,
      );

      schema
        .validate(contactModelWithSubject)
        .catch((validationError: ValidationError) => {
          expect(validationError.errors.length).to.equal(1);
          expect(validationError.inner.length).to.equal(0);
          expect(validationError.path).to.equal('subject');
          done();
        });
    });
  });

  describe('#defaultWithRequiredSubject()', () => {
    beforeEach(() => {
      schema = ContactFormBlocSchema.defaultWithRequiredSubject();
    });

    it('should return a default contact schema', () => {
      expect(typeof schema).to.equal('object');
    });

    it('should allow to specify the name length', done => {
      schema = ContactFormBlocSchema.defaultWithRequiredSubject(2);

      schema
        .validate(contactModelWithSubject)
        .catch((validationError: ValidationError) => {
          expect(validationError.errors.length).to.equal(1);
          expect(validationError.inner.length).to.equal(0);
          expect(validationError.path).to.equal('name');
          done();
        });
    });

    it('should allow to specify the message length', done => {
      schema = ContactFormBlocSchema.defaultWithRequiredSubject(
        ContactFormBlocSchema.DefaultNameLength,
        2,
      );

      schema
        .validate(contactModelWithSubject)
        .catch((validationError: ValidationError) => {
          expect(validationError.errors.length).to.equal(1);
          expect(validationError.inner.length).to.equal(0);
          expect(validationError.path).to.equal('message');
          done();
        });
    });

    it('should allow to specify the subject length', done => {
      schema = ContactFormBlocSchema.defaultWithRequiredSubject(
        ContactFormBlocSchema.DefaultNameLength,
        ContactFormBlocSchema.DefaultMessageLength,
        2,
      );

      schema
        .validate(contactModelWithSubject)
        .catch((validationError: ValidationError) => {
          expect(validationError.errors.length).to.equal(1);
          expect(validationError.inner.length).to.equal(0);
          expect(validationError.path).to.equal('subject');
          done();
        });
    });
  });
});
