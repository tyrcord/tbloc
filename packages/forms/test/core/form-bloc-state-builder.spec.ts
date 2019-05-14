import { expect } from 'chai';
import 'mocha';
import { ValidationError } from 'yup';

import { FormBlocStateBuilder } from '../../src/core/form-bloc-state.builder';
import { FormBlocState } from '../../src/core/form-bloc.state';

describe('FormBlocStateBuilder', () => {
  let builder: FormBlocStateBuilder<FormBlocState>;

  beforeEach(() => {
    builder = new FormBlocStateBuilder();
  });

  describe('#buildDefault()', () => {
    it('should returns a basic form state', () => {
      const formState = builder.buildDefault();

      expect(typeof formState.fields).to.equal('object');
      expect(typeof formState.valid).to.equal('boolean');
      expect(formState.valid).to.equal(false);
    });
  });

  describe('#buildFormFieldState()', () => {
    it('should return an empty form field state when no value is given', () => {
      const formFieldState = builder.buildFormFieldState<string>();
      expect(formFieldState.value).to.equal(void 0);
      expect(formFieldState.required).to.equal(false);
    });

    it('should return a fulfilled form field state when a value is given', () => {
      const formFieldState = builder.buildFormFieldState<string>('hello');
      expect(formFieldState.value).to.equal('hello');
      expect(formFieldState.required).to.equal(false);
    });

    it('should return a fulfilled required form field state when a value is given', () => {
      const formFieldState = builder.buildFormFieldState<string>('hello', true);
      expect(formFieldState.value).to.equal('hello');
      expect(formFieldState.required).to.equal(true);
    });

    it('should return an empty required form field state when no value is given', () => {
      const formFieldState = builder.buildFormFieldState<string>(void 0, true);
      expect(formFieldState.value).to.equal(void 0);
      expect(formFieldState.required).to.equal(true);
    });
  });

  describe('#addErrorsToState()', () => {
    it('should valid a form state when there are no errors', () => {
      const formState = builder.buildDefault();
      builder.addErrorsToState(formState);
      expect(formState.valid).to.equal(true);
    });

    it('should valid a form state when errors are not related to this state', () => {
      const formState = builder.buildDefault();

      builder.addErrorsToState(formState, [
        new ValidationError('error', formState, 'foo'),
      ]);

      expect(formState.valid).to.equal(true);
    });

    it('should invalid a form state when there are errors', () => {
      const formState = builder.buildDefault();
      formState.fields.foo = builder.buildFormFieldState<string>('foo');

      builder.addErrorsToState(formState, [
        new ValidationError('error', formState, 'foo'),
      ]);
      expect(formState.valid).to.equal(false);
    });
  });
});
