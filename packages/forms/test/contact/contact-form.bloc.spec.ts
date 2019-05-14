import { expect } from 'chai';
import 'mocha';
import { skip, take } from 'rxjs/operators';
import * as Sinon from 'sinon';
import { ValidationError } from 'yup';

import { ContactFormBlocStateBuilder } from '../../src/contact/contact-form-bloc-state.builder';
import { ContactFormBlocModel } from '../../src/contact/contact-form-bloc.model';
import { ContactFormBlocSchema } from '../../src/contact/contact-form-bloc.schema';
import { ContactFormBlocState } from '../../src/contact/contact-form-bloc.state';
import { ContactFormBloc } from '../../src/contact/contact-form.bloc';
import { MockContactFormBlocDelegate } from '../mocks/contact-form-bloc.delegate';

// tslint:disable-next-line: no-big-function
describe('ContactFormBloc', () => {
  const stateBuilder = new ContactFormBlocStateBuilder();

  let bloc: ContactFormBloc;
  let contactModel: ContactFormBlocModel;
  let blocDelegate: MockContactFormBlocDelegate;
  let validState: ContactFormBlocState;

  beforeEach(() => {
    bloc = new ContactFormBloc();
    blocDelegate = new MockContactFormBlocDelegate();
    bloc.delegate = blocDelegate;

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

      bloc.stream.pipe(take(1)).subscribe(state => {
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
      bloc.stream
        .pipe(
          skip(1),
          take(1),
        )
        .subscribe(({ fields: { name } }) => {
          expect(name.value).to.equal('foo');
          expect(name.valid).to.equal(true);
          expect(name.required).to.equal(true);
          done();
        });

      bloc.onNameChange('foo');
    });

    it(`should not call the delegate method "blocDidValidateModel" when the
     model is not valid`, done => {
      const spyOnDidValidateModel = Sinon.spy(
        blocDelegate,
        'blocDidValidateModel',
      );
      blocDelegate.blocDidValidateModel = spyOnDidValidateModel;

      setTimeout(() => {
        expect(spyOnDidValidateModel.called).to.equal(false);
        done();
      }, 0); // wait for the next tick

      bloc.onNameChange('foo');
    });

    it(`should call the delegate method "blocDidValidateModel" when the BloC did
     validate the new FormBloc model`, done => {
      const spyOnDidValidateModel = Sinon.spy(
        blocDelegate,
        'blocDidValidateModel',
      );
      blocDelegate.blocDidValidateModel = spyOnDidValidateModel;
      bloc = new ContactFormBloc(validState);
      bloc.delegate = blocDelegate;

      setTimeout(() => {
        expect(spyOnDidValidateModel.called).to.equal(true);

        const lastCall = spyOnDidValidateModel.lastCall;
        const [, , model] = lastCall.args;

        expect(model.name).to.equal('qux');
        done();
      }, 0); // wait for the next tick

      bloc.onNameChange('qux');
    });
  });

  describe('#onEmailChange()', () => {
    it('should dispatch a new state when the `email` value change', done => {
      bloc.stream
        .pipe(
          skip(1),
          take(1),
        )
        .subscribe(({ fields: { email } }) => {
          expect(email.value).to.equal('qux@tyrcord.com');
          expect(email.valid).to.equal(true);
          expect(email.required).to.equal(true);
          done();
        });

      bloc.onEmailChange('qux@tyrcord.com');
    });

    it(`should not call the delegate method "blocDidValidateModel" when the
     model is not valid`, done => {
      const spyOnDidValidateModel = Sinon.spy(
        blocDelegate,
        'blocDidValidateModel',
      );
      blocDelegate.blocDidValidateModel = spyOnDidValidateModel;

      setTimeout(() => {
        expect(spyOnDidValidateModel.called).to.equal(false);
        done();
      }, 0); // wait for the next tick

      bloc.onEmailChange('foo@tyrcord.com');
    });

    it(`should call the delegate method "blocDidValidateModel" when the BloC did
     validate the new FormBloc model`, done => {
      const spyOnDidValidateModel = Sinon.spy(
        blocDelegate,
        'blocDidValidateModel',
      );
      blocDelegate.blocDidValidateModel = spyOnDidValidateModel;
      bloc = new ContactFormBloc(validState);
      bloc.delegate = blocDelegate;

      setTimeout(() => {
        expect(spyOnDidValidateModel.called).to.equal(true);

        const lastCall = spyOnDidValidateModel.lastCall;
        const [, , model] = lastCall.args;

        expect(model.email).to.equal('qux@tyrcord.com');
        done();
      }, 0); // wait for the next tick

      bloc.onEmailChange('qux@tyrcord.com');
    });
  });

  describe('#onSubjectChange()', () => {
    it('should dispatch a new state when the `subject` value change', done => {
      bloc.stream
        .pipe(
          skip(1),
          take(1),
        )
        .subscribe(({ fields: { subject } }) => {
          expect(subject.value).to.equal('question');
          expect(subject.valid).to.equal(true);
          expect(subject.required).to.equal(false);
          done();
        });

      bloc.onSubjectChange('question');
    });

    it(`should not call the delegate method "blocDidValidateModel" when the
     model is not valid`, done => {
      const spyOnDidValidateModel = Sinon.spy(
        blocDelegate,
        'blocDidValidateModel',
      );
      blocDelegate.blocDidValidateModel = spyOnDidValidateModel;

      setTimeout(() => {
        expect(spyOnDidValidateModel.called).to.equal(false);
        done();
      }, 0); // wait for the next tick

      bloc.onSubjectChange('question');
    });

    it(`should call the delegate method "blocDidValidateModel" when the BloC did
     validate the new FormBloc model`, done => {
      const spyOnDidValidateModel = Sinon.spy(
        blocDelegate,
        'blocDidValidateModel',
      );
      blocDelegate.blocDidValidateModel = spyOnDidValidateModel;
      bloc = new ContactFormBloc(validState);
      bloc.delegate = blocDelegate;

      setTimeout(() => {
        expect(spyOnDidValidateModel.called).to.equal(true);

        const lastCall = spyOnDidValidateModel.lastCall;
        const [, , model] = lastCall.args;

        expect(model.subject).to.equal('question');
        done();
      }, 0); // wait for the next tick

      bloc.onSubjectChange('question');
    });
  });

  describe('#onMessageChange()', () => {
    it('should dispatch a new state when the `message` value change', done => {
      bloc.stream
        .pipe(
          skip(1),
          take(1),
        )
        .subscribe(({ fields: { message } }) => {
          expect(message.value).to.equal('message');
          expect(message.valid).to.equal(true);
          expect(message.required).to.equal(true);
          done();
        });

      bloc.onMessageChange('message');
    });

    it(`should not call the delegate method "blocDidValidateModel" when the
     model is not valid`, done => {
      const spyOnDidValidateModel = Sinon.spy(
        blocDelegate,
        'blocDidValidateModel',
      );
      blocDelegate.blocDidValidateModel = spyOnDidValidateModel;

      setTimeout(() => {
        expect(spyOnDidValidateModel.called).to.equal(false);
        done();
      }, 0); // wait for the next tick

      bloc.onMessageChange('message');
    });

    it(`should call the delegate method "blocDidValidateModel" when the BloC did
     validate the new FormBloc model`, done => {
      const spyOnDidValidateModel = Sinon.spy(
        blocDelegate,
        'blocDidValidateModel',
      );
      blocDelegate.blocDidValidateModel = spyOnDidValidateModel;
      bloc = new ContactFormBloc(validState);
      bloc.delegate = blocDelegate;

      setTimeout(() => {
        expect(spyOnDidValidateModel.called).to.equal(true);

        const lastCall = spyOnDidValidateModel.lastCall;
        const [, , model] = lastCall.args;

        expect(model.message).to.equal('message');
        done();
      }, 0); // wait for the next tick

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
