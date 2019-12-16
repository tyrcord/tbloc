import { expect } from 'chai';
import 'mocha';

import { ContactFormBlocEvent } from '../../src/contact';

describe('ContactFormBlocEvent', () => {
  let event: ContactFormBlocEvent;

  beforeEach(() => {
    event = new ContactFormBlocEvent();
  });

  describe('#type', () => {
    it('should be a string', () => {
      expect(typeof event.type).to.equal('string');
    });

    it('should have a predefined value', () => {
      expect(event.type).to.equal(ContactFormBlocEvent.Type);
    });
  });
});
