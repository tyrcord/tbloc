import { expect } from 'chai';
import 'mocha';
import { Observable, of, throwError } from 'rxjs';
import { delay, skipWhile, take } from 'rxjs/operators';
import * as Sinon from 'sinon';
import { UnidirectionalBlocDelegate } from '../../src/types/unidirectional-bloc-delegate.type';
import {
  UnidirectionalBlocTransitionEnd,
  UnidirectionalBlocTransitionStart,
} from '../../src/types/unidirectional-bloc-transition.type';
import { UnidirectionalPeopleBlocDelegate } from '../mocks/people-bloc-delegate.mock';
import { PeopleBlocState } from '../mocks/people-bloc-state.mock';
import { UnidirectionalPeopleBloc } from '../mocks/people-bloc.mock';

describe('UnidirectionalBloc', () => {
  let bloc: UnidirectionalPeopleBloc;

  beforeEach(() => {
    bloc = new UnidirectionalPeopleBloc({
      age: 42,
      firstname: 'foo',
      lastname: 'bar',
    });
  });

  afterEach(() => {
    bloc.dispose();
  });

  describe('#stream', () => {
    it('should be an observable', () => {
      expect(bloc.stream).to.be.instanceOf(Observable);
    });

    it("should dispatch states when BLoC's states change", done => {
      let count = 0;

      bloc.stream.pipe(take(3)).subscribe(state => {
        expect(state.firstname).to.equal(
          ++count === 1 ? 'foo' : count === 2 ? 'baz' : 'qux',
        );

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

    it("should return the lastest state when a BLoC's state has been updated", done => {
      bloc.patch({
        firstname: 'baz',
      });

      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'baz'),
          take(1),
        )
        .subscribe(() => {
          const state = bloc.currentState;
          expect(state.firstname).to.equal('baz');
          expect(state.lastname).to.equal('bar');
          expect(state.age).to.equal(42);
          done();
        });
    });
  });

  describe('#patchState()', () => {
    let spyOnStateWillChange: any;
    let spyOnStateDidChange: any;
    let spyOnError: any;

    const nextState = {
      firstname: 'baz',
    };

    beforeEach(() => {
      const delegate = new UnidirectionalPeopleBlocDelegate();
      spyOnStateWillChange = Sinon.spy(delegate, 'blocStateWillChange');
      spyOnStateDidChange = Sinon.spy(delegate, 'blocStateDidChange');
      delegate.blocStateWillChange = spyOnStateWillChange;
      delegate.blocStateDidChange = spyOnStateDidChange;
      bloc.delegate = delegate;
    });

    it("should set a subset of values of a Bloc's state", done => {
      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'baz'),
          take(1),
        )
        .subscribe(state => {
          expect(state.firstname).to.equal('baz');
          expect(state.lastname).to.equal('bar');
          expect(state.age).to.equal(42);
          done();
        });

      bloc.patch(nextState);
    });

    it("should call the delegate method `blocStateWillChange` when a Bloc's state change", done => {
      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'baz'),
          take(1),
        )
        .subscribe(() => {
          expect(spyOnStateWillChange.called).to.equal(true);

          const lastCall = spyOnStateWillChange.lastCall;
          const transition: UnidirectionalBlocTransitionStart<PeopleBlocState> =
            lastCall.args[1];
          const currentState = transition.currentState;
          const transitionNextState = transition.nextState;

          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          expect(transitionNextState.firstname).to.equal('baz');
          expect(transitionNextState.lastname).to.equal('bar');
          expect(transitionNextState.age).to.equal(42);
          done();
        });

      bloc.patch(nextState);
    });

    it("should call the delegate method `blocStateDidChange` when a Bloc's state has been updated", done => {
      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'baz'),
          take(1),
          delay(0), // wait for the next tick
        )
        .subscribe(() => {
          expect(spyOnStateDidChange.called).to.equal(true);

          const lastCall = spyOnStateDidChange.lastCall;
          const transition: UnidirectionalBlocTransitionEnd<PeopleBlocState> =
            lastCall.args[1];

          const currentState = transition.currentState;
          const previousState = transition.previousState;

          expect(currentState.firstname).to.equal('baz');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          expect(previousState.firstname).to.equal('foo');
          expect(previousState.lastname).to.equal('bar');
          expect(previousState.age).to.equal(42);

          done();
        });

      bloc.patch(nextState);
    });

    it('should call the delegate method `blocDidCatchError` when the delegate method `blocStateWillChange` throws an error', done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): PeopleBlocState {
          throw new Error('unknown error');
        },
        blocDidCatchError() {},
      };

      spyOnError = Sinon.spy(delegate, 'blocDidCatchError');
      delegate.blocDidCatchError = spyOnError;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          delay(0), // wait for the next tick
          take(1),
        )
        .subscribe(() => {
          expect(spyOnError.called).to.equal(true);

          const lastCall = spyOnError.lastCall;
          const error: Error = lastCall.args[1];
          const currentState = bloc.currentState;

          expect(error.message).to.equal('unknown error');
          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          done();
        });

      bloc.patch(nextState);
    });

    it('should call the delegate method `blocDidCatchError` when the delegate method `blocStateWillChange` returns a rejected Promise', done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): Promise<PeopleBlocState> {
          return Promise.reject(new Error('unknown error'));
        },
        blocDidCatchError() {},
      };

      spyOnError = Sinon.spy(delegate, 'blocDidCatchError');
      delegate.blocDidCatchError = spyOnError;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          delay(0), // wait for the next tick
          take(1),
        )
        .subscribe(() => {
          expect(spyOnError.called).to.equal(true);

          const lastCall = spyOnError.lastCall;
          const error: Error = lastCall.args[1];
          const currentState = bloc.currentState;

          expect(error.message).to.equal('unknown error');
          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          done();
        });

      bloc.patch(nextState);
    });

    it('should call the delegate method `blocDidCatchError` when the delegate method `blocStateWillChange` returns an Observable that emit an error', done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): Observable<PeopleBlocState> {
          return throwError('unknown error');
        },
        blocDidCatchError() {},
      };

      spyOnError = Sinon.spy(delegate, 'blocDidCatchError');
      delegate.blocDidCatchError = spyOnError;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          delay(0), // wait for the next tick
          take(1),
        )
        .subscribe(() => {
          expect(spyOnError.called).to.equal(true);

          const lastCall = spyOnError.lastCall;
          const error: Error = lastCall.args[1];
          const currentState = bloc.currentState;

          expect(error.message).to.equal('unknown error');
          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          done();
        });

      bloc.patch(nextState);
    });

    it("should update a BloC's state when the delegate method `blocStateWillChange` returns a new state", done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): PeopleBlocState {
          return {
            firstname: 'qux',
          };
        },
      };

      spyOnStateWillChange = Sinon.spy(delegate, 'blocStateWillChange');
      delegate.blocStateWillChange = spyOnStateWillChange;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'qux'),
          take(1),
        )
        .subscribe(state => {
          expect(spyOnStateWillChange.called).to.equal(true);

          const lastCall = spyOnStateWillChange.lastCall;
          const transition: UnidirectionalBlocTransitionStart<PeopleBlocState> =
            lastCall.args[1];
          const currentState = transition.currentState;
          const transitionNextState = transition.nextState;

          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          expect(transitionNextState.firstname).to.equal('baz');
          expect(transitionNextState.lastname).to.equal('bar');
          expect(transitionNextState.age).to.equal(42);

          expect(state.firstname).to.equal('qux');
          expect(state.lastname).to.be.equal(void 0);
          expect(state.age).to.be.equal(void 0);

          done();
        });

      bloc.patch(nextState);
    });

    it("should update a BloC's state when the delegate method `blocStateWillChange` returns a Promise", done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): Promise<PeopleBlocState> {
          return Promise.resolve<PeopleBlocState>({
            firstname: 'qux',
          });
        },
      };

      spyOnStateWillChange = Sinon.spy(delegate, 'blocStateWillChange');
      delegate.blocStateWillChange = spyOnStateWillChange;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'qux'),
          take(1),
        )
        .subscribe(state => {
          expect(spyOnStateWillChange.called).to.equal(true);

          const lastCall = spyOnStateWillChange.lastCall;
          const transition: UnidirectionalBlocTransitionStart<PeopleBlocState> =
            lastCall.args[1];
          const currentState = transition.currentState;
          const transitionNextState = transition.nextState;

          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          expect(transitionNextState.firstname).to.equal('baz');
          expect(transitionNextState.lastname).to.equal('bar');
          expect(transitionNextState.age).to.equal(42);

          expect(state.firstname).to.equal('qux');
          expect(state.lastname).to.be.equal(void 0);
          expect(state.age).to.be.equal(void 0);

          done();
        });

      bloc.patch(nextState);
    });

    it("should update a BloC's state when the delegate method `blocStateWillChange` returns an Observable", done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): Observable<PeopleBlocState> {
          return of<PeopleBlocState>({
            firstname: 'qux',
          });
        },
      };

      spyOnStateWillChange = Sinon.spy(delegate, 'blocStateWillChange');
      delegate.blocStateWillChange = spyOnStateWillChange;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'qux'),
          take(1),
        )
        .subscribe(state => {
          expect(spyOnStateWillChange.called).to.equal(true);

          const lastCall = spyOnStateWillChange.lastCall;
          const transition: UnidirectionalBlocTransitionStart<PeopleBlocState> =
            lastCall.args[1];
          const currentState = transition.currentState;
          const transitionNextState = transition.nextState;

          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          expect(transitionNextState.firstname).to.equal('baz');
          expect(transitionNextState.lastname).to.equal('bar');
          expect(transitionNextState.age).to.equal(42);

          expect(state.firstname).to.equal('qux');
          expect(state.lastname).to.be.equal(void 0);
          expect(state.age).to.be.equal(void 0);

          done();
        });

      bloc.patch(nextState);
    });
  });

  describe('#setState()', () => {
    let spyOnStateWillChange: any;
    let spyOnStateDidChange: any;
    let spyOnError: any;

    const nextState = {
      firstname: 'baz',
    };

    beforeEach(() => {
      const delegate = new UnidirectionalPeopleBlocDelegate();
      spyOnStateWillChange = Sinon.spy(delegate, 'blocStateWillChange');
      spyOnStateDidChange = Sinon.spy(delegate, 'blocStateDidChange');
      delegate.blocStateWillChange = spyOnStateWillChange;
      delegate.blocStateDidChange = spyOnStateDidChange;
      bloc.delegate = delegate;
    });

    it("should set the subset of the values of a Bloc's state", done => {
      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'baz'),
          take(1),
        )
        .subscribe(state => {
          expect(state.firstname).to.equal('baz');
          expect(state.lastname).to.be.equal(void 0);
          expect(state.age).to.be.equal(void 0);
          done();
        });

      bloc.put(nextState);
    });

    it("should call the delegate method `blocStateWillChange` when a Bloc's state change", done => {
      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'baz'),
          take(1),
        )
        .subscribe(() => {
          expect(spyOnStateWillChange.called).to.equal(true);

          const lastCall = spyOnStateWillChange.lastCall;
          const transition: UnidirectionalBlocTransitionStart<PeopleBlocState> =
            lastCall.args[1];
          const currentState = transition.currentState;
          const transitionNextState = transition.nextState;

          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          expect(transitionNextState.firstname).to.equal('baz');
          expect(transitionNextState.lastname).to.be.equal(void 0);
          expect(transitionNextState.age).to.be.equal(void 0);
          done();
        });

      bloc.put(nextState);
    });

    it("should call the delegate method `blocStateDidChange` when a Bloc's state has been updated", done => {
      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'baz'),
          take(1),
          delay(0), // wait for the next tick
        )
        .subscribe(() => {
          expect(spyOnStateDidChange.called).to.equal(true);

          const lastCall = spyOnStateDidChange.lastCall;
          const transition: UnidirectionalBlocTransitionEnd<PeopleBlocState> =
            lastCall.args[1];

          const currentState = transition.currentState;
          const previousState = transition.previousState;

          expect(currentState.firstname).to.equal('baz');
          expect(currentState.lastname).to.be.equal(void 0);
          expect(currentState.age).to.be.equal(void 0);

          expect(previousState.firstname).to.equal('foo');
          expect(previousState.lastname).to.equal('bar');
          expect(previousState.age).to.equal(42);

          done();
        });

      bloc.put(nextState);
    });

    it('should call the delegate method `blocDidCatchError` when the delegate method `blocStateWillChange` throws an error', done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): PeopleBlocState {
          throw new Error('unknown error');
        },
        blocDidCatchError() {},
      };

      spyOnError = Sinon.spy(delegate, 'blocDidCatchError');
      delegate.blocDidCatchError = spyOnError;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          delay(0), // wait for the next tick
          take(1),
        )
        .subscribe(() => {
          expect(spyOnError.called).to.equal(true);

          const lastCall = spyOnError.lastCall;
          const error: Error = lastCall.args[1];
          const currentState = bloc.currentState;

          expect(error.message).to.equal('unknown error');
          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          done();
        });

      bloc.put(nextState);
    });

    it('should call the delegate method `blocDidCatchError` when the delegate method `blocStateWillChange` returns a rejected Promise', done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): Promise<PeopleBlocState> {
          return Promise.reject(new Error('unknown error'));
        },
        blocDidCatchError() {},
      };

      spyOnError = Sinon.spy(delegate, 'blocDidCatchError');
      delegate.blocDidCatchError = spyOnError;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          delay(0), // wait for the next tick
          take(1),
        )
        .subscribe(() => {
          expect(spyOnError.called).to.equal(true);

          const lastCall = spyOnError.lastCall;
          const error: Error = lastCall.args[1];
          const currentState = bloc.currentState;

          expect(error.message).to.equal('unknown error');
          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          done();
        });

      bloc.put(nextState);
    });

    it('should call the delegate method `blocDidCatchError` when the delegate method `blocStateWillChange` returns an Observable that emit an error', done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): Observable<PeopleBlocState> {
          return throwError('unknown error');
        },
        blocDidCatchError() {},
      };

      spyOnError = Sinon.spy(delegate, 'blocDidCatchError');
      delegate.blocDidCatchError = spyOnError;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          delay(0), // wait for the next tick
          take(1),
        )
        .subscribe(() => {
          expect(spyOnError.called).to.equal(true);

          const lastCall = spyOnError.lastCall;
          const error: Error = lastCall.args[1];
          const currentState = bloc.currentState;

          expect(error.message).to.equal('unknown error');
          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          done();
        });

      bloc.put(nextState);
    });

    it("should update a BloC's state when the delegate method `blocStateWillChange` returns a new state", done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): PeopleBlocState {
          return {
            firstname: 'qux',
          };
        },
      };

      spyOnStateWillChange = Sinon.spy(delegate, 'blocStateWillChange');
      delegate.blocStateWillChange = spyOnStateWillChange;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'qux'),
          take(1),
        )
        .subscribe(state => {
          expect(spyOnStateWillChange.called).to.equal(true);

          const lastCall = spyOnStateWillChange.lastCall;
          const transition: UnidirectionalBlocTransitionStart<PeopleBlocState> =
            lastCall.args[1];
          const currentState = transition.currentState;
          const transitionNextState = transition.nextState;

          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          expect(transitionNextState.firstname).to.equal('baz');
          expect(transitionNextState.lastname).to.be.equal(void 0);
          expect(transitionNextState.age).to.be.equal(void 0);

          expect(state.firstname).to.equal('qux');
          expect(state.lastname).to.be.equal(void 0);
          expect(state.age).to.be.equal(void 0);

          done();
        });

      bloc.put(nextState);
    });

    it("should update a BloC's state when the delegate method `blocStateWillChange` returns a Promise", done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): Promise<PeopleBlocState> {
          return Promise.resolve<PeopleBlocState>({
            firstname: 'qux',
          });
        },
      };

      spyOnStateWillChange = Sinon.spy(delegate, 'blocStateWillChange');
      delegate.blocStateWillChange = spyOnStateWillChange;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'qux'),
          take(1),
        )
        .subscribe(state => {
          expect(spyOnStateWillChange.called).to.equal(true);

          const lastCall = spyOnStateWillChange.lastCall;
          const transition: UnidirectionalBlocTransitionStart<PeopleBlocState> =
            lastCall.args[1];
          const currentState = transition.currentState;
          const transitionNextState = transition.nextState;

          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          expect(transitionNextState.firstname).to.equal('baz');
          expect(transitionNextState.lastname).to.be.equal(void 0);
          expect(transitionNextState.age).to.be.equal(void 0);

          expect(state.firstname).to.equal('qux');
          expect(state.lastname).to.be.equal(void 0);
          expect(state.age).to.be.equal(void 0);

          done();
        });

      bloc.put(nextState);
    });

    it("should update a BloC's state when the delegate method `blocStateWillChange` returns an Observable", done => {
      const delegate: UnidirectionalBlocDelegate<PeopleBlocState> = {
        blocStateWillChange(): Observable<PeopleBlocState> {
          return of<PeopleBlocState>({
            firstname: 'qux',
          });
        },
      };

      spyOnStateWillChange = Sinon.spy(delegate, 'blocStateWillChange');
      delegate.blocStateWillChange = spyOnStateWillChange;
      bloc.delegate = delegate;

      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'qux'),
          take(1),
        )
        .subscribe(state => {
          expect(spyOnStateWillChange.called).to.equal(true);

          const lastCall = spyOnStateWillChange.lastCall;
          const transition: UnidirectionalBlocTransitionStart<PeopleBlocState> =
            lastCall.args[1];
          const currentState = transition.currentState;
          const transitionNextState = transition.nextState;

          expect(currentState.firstname).to.equal('foo');
          expect(currentState.lastname).to.equal('bar');
          expect(currentState.age).to.equal(42);

          expect(transitionNextState.firstname).to.equal('baz');
          expect(transitionNextState.lastname).to.be.equal(void 0);
          expect(transitionNextState.age).to.be.equal(void 0);

          expect(state.firstname).to.equal('qux');
          expect(state.lastname).to.be.equal(void 0);
          expect(state.age).to.be.equal(void 0);

          done();
        });

      bloc.put(nextState);
    });
  });
});
