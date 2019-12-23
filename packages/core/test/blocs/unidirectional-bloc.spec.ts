import { expect } from 'chai';
import 'mocha';
import { Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import { PeopleBlocState } from '../mocks/people-bloc-state.mock';
import { UnidirectionalPeopleBloc } from '../mocks/unidirectional-people-bloc.mock';

describe('UnidirectionalPeopleBloc', () => {
  let bloc: UnidirectionalPeopleBloc;
  const defaultState: PeopleBlocState = {
    age: 42,
    firstname: 'foo',
    lastname: 'bar',
  };

  beforeEach(() => {
    bloc = new UnidirectionalPeopleBloc(defaultState);
  });

  afterEach(() => {
    bloc.dispose();
  });

  describe('#UnidirectionalPeopleBloc()', () => {
    it('should return a UnidirectionalPeopleBloc object', () => {
      expect(
        new UnidirectionalPeopleBloc(defaultState) instanceof
          UnidirectionalPeopleBloc,
      ).to.equal(true);
    });

    it('should initialize its state', () => {
      bloc = new UnidirectionalPeopleBloc(defaultState);

      expect(bloc.currentState.firstname).to.equal('foo');
      expect(bloc.currentState.lastname).to.equal('bar');
      expect(bloc.currentState.age).to.equal(42);

      bloc = new UnidirectionalPeopleBloc(null, () => defaultState);

      expect(bloc.currentState.firstname).to.equal('foo');
      expect(bloc.currentState.lastname).to.equal('bar');
      expect(bloc.currentState.age).to.equal(42);
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

      bloc.patch({
        firstname: 'baz',
      });

      bloc.patch({
        firstname: 'qux',
      });
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
      done => {
        bloc.patch({
          firstname: 'baz',
        });

        bloc.onData
          .pipe(
            skipWhile(state => state.firstname !== 'baz'),
            take(1),
          )
          .toPromise()
          .then(lastState => {
            expect(lastState).to.equal(bloc.currentState);
            done();
          });
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

      bloc.patch({
        age: 24,
      });

      bloc.reset();

      bloc.patch({
        age: 12,
      });
    });
  });

  describe('#dispose()', () => {
    it('should close the bloc onData observable', done => {
      bloc.onData.pipe(take(1)).subscribe(({ age }) => {
        expect(age).to.not.be.equal(12);
        done();
      });

      bloc.dispose();

      bloc.patch({
        age: 12,
      });
    });
  });
});
