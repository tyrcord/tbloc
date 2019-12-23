import { expect } from 'chai';
import 'mocha';
import { Observable } from 'rxjs';
import { map, skip, skipWhile, take } from 'rxjs/operators';

import { BidirectionalPeopleBloc } from '../mocks/bidirectional-people-bloc.mock';
import { PeopleBlocEvent } from '../mocks/people-bloc-event.mock';
import { PeopleBlocState } from '../mocks/people-bloc-state.mock';

describe('BidirectionalBloc', () => {
  let bloc: BidirectionalPeopleBloc;
  const defaultState: PeopleBlocState = {
    age: 42,
    firstname: 'foo',
    lastname: 'bar',
  };

  beforeEach(() => {
    bloc = new BidirectionalPeopleBloc(defaultState);
  });

  afterEach(() => {
    bloc.dispose();
  });

  describe('#BidirectionalPeopleBloc()', () => {
    it('should return a BidirectionalPeopleBloc object', () => {
      expect(
        new BidirectionalPeopleBloc(defaultState) instanceof
          BidirectionalPeopleBloc,
      ).to.equal(true);
    });

    it('should initialize its state', () => {
      bloc = new BidirectionalPeopleBloc(defaultState);

      expect(bloc.currentState.firstname).to.equal('foo');
      expect(bloc.currentState.lastname).to.equal('bar');
      expect(bloc.currentState.age).to.equal(42);

      bloc = new BidirectionalPeopleBloc(null, () => defaultState);

      expect(bloc.currentState.firstname).to.equal('foo');
      expect(bloc.currentState.lastname).to.equal('bar');
      expect(bloc.currentState.age).to.equal(42);
    });
  });

  describe('#dispatchEvent', () => {
    it("should update a BLoC's state when an Event is dispatched", done => {
      bloc.onData
        .pipe(skip(1), take(1))
        .toPromise()
        .then(lastState => {
          expect(lastState.firstname).to.equal('baz');
          expect(lastState.lastname).to.equal('bar');
          expect(lastState.age).to.equal(42);

          done();
        });

      bloc.dispatchEvent(
        new PeopleBlocEvent({
          firstname: 'baz',
        }),
      );
    });
  });

  describe('#onData', () => {
    it('should be an observable', () => {
      expect(bloc.onData).to.be.instanceOf(Observable);
    });

    it("should dispatch states a when BLoC's states change", done => {
      let count = 0;

      bloc.onData.pipe(take(3)).subscribe(({ firstname }) => {
        switch (count) {
          case 0:
            expect(firstname).to.equal('foo');
            break;
          case 1:
            expect(firstname).to.equal('baz');
            break;
          case 2:
            expect(firstname).to.equal('qux');
            break;
        }

        count = count + 1;

        if (count === 3) {
          done();
        }
      });

      bloc.dispatchEvent(
        new PeopleBlocEvent({
          firstname: 'baz',
        }),
      );

      bloc.dispatchEvent(
        new PeopleBlocEvent({
          firstname: 'qux',
        }),
      );
    });
  });

  describe('#onError', () => {
    it('should be an Observable', () => {
      expect(bloc.onError instanceof Observable).to.equal(true);
    });

    it(
      'should dispatch an error when an error occurs ' +
        'when mapping an event to state',
      done => {
        bloc.onError
          .pipe(
            take(1),
            map((error: Error) => error.message),
          )
          .toPromise()
          .then(message => {
            expect(message).to.equal('error');
            done();
          });

        bloc.dispatchEvent(PeopleBlocEvent.error());
      },
    );
  });

  describe('#onEvent', () => {
    it('should be an Observable', () => {
      expect(bloc.onEvent instanceof Observable).to.equal(true);
    });

    it('should dispatch an event when a BloC receives an event', done => {
      const event = new PeopleBlocEvent({
        firstname: 'baz',
      });

      bloc.onEvent
        .pipe(take(1))
        .toPromise()
        .then(innerEvent => {
          expect(event).to.equal(innerEvent);
          done();
        });

      bloc.dispatchEvent(event);
    });
  });

  describe('#currentState', () => {
    it('should return the inital state when a BLoC has been instantiated', () => {
      const state = bloc.currentState;
      expect(state.firstname).to.equal('foo');
      expect(state.lastname).to.equal('bar');
      expect(state.age).to.equal(42);
    });

    it(
      'should return the lastest state ' +
        "when a BLoC's state has been updated",
      async () => {
        bloc.dispatchEvent(new PeopleBlocEvent({ firstname: 'baz' }));

        const lastState = await bloc.onData
          .pipe(
            skipWhile(state => state.firstname !== 'baz'),
            take(1),
          )
          .toPromise();

        expect(lastState).to.equal(bloc.currentState);
      },
    );
  });

  describe('#reset()', () => {
    it("should reset a BLoC's state", done => {
      let count = 0;

      bloc.onData.pipe(take(4)).subscribe(({ age }) => {
        switch (count) {
          case 0:
            expect(age).to.equal(42);
            break;
          case 1:
            expect(age).to.equal(24);
            break;
          case 2:
            expect(age).to.equal(42);
            break;
          case 3:
            expect(age).to.equal(12);
            break;
        }

        count = count + 1;

        if (count === 4) {
          done();
        }
      });

      bloc.dispatchEvent(
        new PeopleBlocEvent({
          age: 24,
        }),
      );

      bloc.reset();

      bloc.dispatchEvent(
        new PeopleBlocEvent({
          age: 12,
        }),
      );
    });
  });

  describe('#dispose()', () => {
    it('should close the bloc onData observable', done => {
      bloc.onData.pipe(take(1)).subscribe(({ age }) => {
        expect(age).to.not.be.equal(12);
        done();
      });

      bloc.dispose();

      bloc.dispatchEvent(
        new PeopleBlocEvent({
          age: 12,
        }),
      );
    });
  });
});
