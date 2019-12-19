import { expect } from 'chai';
import 'mocha';
import { Observable, of, throwError } from 'rxjs';
import { delay, skip, skipWhile, take } from 'rxjs/operators';
import Sinon from 'sinon';

import { BidirectionalBlocUpdateStrategy } from '../../src/enums';

import { BidirectionalPeopleBlocDelegate } from '../mocks/bidirectional-people-bloc-delegate.mock';
import { BidirectionalPeopleBloc } from '../mocks/bidirectional-people-bloc.mock';
import { PeopleBlocEvent } from '../mocks/people-bloc-event.mock';
import { PeopleBlocState } from '../mocks/people-bloc-state.mock';

import {
  IBlocStateTransitionEnd,
  IBlocStateTransitionStart,
} from '../../src/interfaces';

describe('BidirectionalBloc', () => {
  let bloc: BidirectionalPeopleBloc;

  beforeEach(() => {
    bloc = new BidirectionalPeopleBloc({
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

      bloc.stream.pipe(skip(1), take(2)).subscribe(({ firstname }) => {
        expect(firstname).to.equal(!count ? 'baz' : 'qux');

        if (++count === 2) {
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

    const nextState = {
      firstname: 'baz',
    };

    beforeEach(() => {
      const delegate = new BidirectionalPeopleBlocDelegate();
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
          const transition: IBlocStateTransitionStart<PeopleBlocState> =
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
          const transition: IBlocStateTransitionEnd<PeopleBlocState> =
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
  });

  describe('#setState()', () => {
    let spyOnStateWillChange: any;
    let spyOnStateDidChange: any;

    const nextState = {
      firstname: 'baz',
    };

    beforeEach(() => {
      const delegate = new BidirectionalPeopleBlocDelegate();
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
          const transition: IBlocStateTransitionStart<PeopleBlocState> =
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
          const transition: IBlocStateTransitionEnd<PeopleBlocState> =
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
  });

  describe('#updateStrategy', () => {
    it('should be a string', () => {
      expect(typeof bloc.getUpdateStrategy()).to.equal('string');
    });

    it('should be `merge` by default', () => {
      expect(bloc.getUpdateStrategy()).to.equal(
        BidirectionalBlocUpdateStrategy.merge,
      );
    });

    it("should set a subset of values of a Bloc's state when is value is set to `merge`", done => {
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

      bloc.dispatchEvent({
        payload: {
          firstname: 'baz',
        },
        type: PeopleBlocEvent.Type,
      });
    });

    it("should set a Bloc's state when is value is set to `replace`", done => {
      bloc.setUpdateStrategy(BidirectionalBlocUpdateStrategy.replace);

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

      bloc.dispatchEvent({
        payload: {
          firstname: 'baz',
        },
        type: PeopleBlocEvent.Type,
      });
    });
  });

  describe('#dispatchEvent', () => {
    let spyOnBlocWillProcessEvent: any;
    let spyOnBlocDidProcessEvent: any;
    let defaultPeopleBlocEvent: any;
    let spyonBlocDidCatchError: any;
    let delegate: BidirectionalPeopleBlocDelegate;

    beforeEach(() => {
      delegate = new BidirectionalPeopleBlocDelegate();

      spyOnBlocWillProcessEvent = Sinon.spy(delegate, 'blocWillProcessEvent');
      spyOnBlocDidProcessEvent = Sinon.spy(delegate, 'blocDidProcessEvent');
      spyonBlocDidCatchError = Sinon.spy(delegate, 'blocDidCatchError');

      delegate.blocWillProcessEvent = spyOnBlocWillProcessEvent;
      delegate.blocDidProcessEvent = spyOnBlocDidProcessEvent;
      delegate.blocDidCatchError = spyonBlocDidCatchError;

      bloc.delegate = delegate;

      defaultPeopleBlocEvent = {
        payload: {
          firstname: 'baz',
        },
        type: PeopleBlocEvent.Type,
      };
    });

    it("should update a BLoC's state when an Event is dispatched", done => {
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

      bloc.dispatchEvent(defaultPeopleBlocEvent);
    });

    it("should set a subset of values of a Bloc's state by default when an Event is dispatched", done => {
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

      bloc.dispatchEvent(defaultPeopleBlocEvent);
    });

    it("should set a Bloc's state when an Event is dispatched with the metadata `updateStrategy` set to `replace`", done => {
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

      bloc.dispatchEvent({
        ...defaultPeopleBlocEvent,
        meta: {
          updateStrategy: BidirectionalBlocUpdateStrategy.replace,
        },
      });
    });

    it('should call the delegate method `blocWillProcessEvent` when a delegate respond to it', done => {
      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'baz'),
          take(1),
        )
        .subscribe(() => {
          expect(spyOnBlocWillProcessEvent.called).to.equal(true);

          const lastCall = spyOnBlocWillProcessEvent.lastCall;
          const event: PeopleBlocEvent = lastCall.args[1];

          expect(event).to.equal(defaultPeopleBlocEvent);
          done();
        });

      bloc.dispatchEvent(defaultPeopleBlocEvent);
    });

    it('should call the delegate method `blocDidProcessEvent` when a delegate respond to it', done => {
      bloc.stream
        .pipe(
          skipWhile(({ firstname }) => firstname !== 'baz'),
          take(1),
          delay(100),
        )
        .subscribe(() => {
          expect(spyOnBlocDidProcessEvent.called).to.equal(true);
          done();
        });

      bloc.dispatchEvent(defaultPeopleBlocEvent);
    });

    it("should update a BloC's state when the method `mapEventToState` returns a State", done => {
      Sinon.stub(bloc, 'mapEventToState' as any).callsFake(() => {
        return {
          firstname: 'qux',
        };
      });

      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'qux'),
          take(1),
        )
        .subscribe(state => {
          expect(state.firstname).to.equal('qux');
          expect(state.lastname).to.equal('bar');
          expect(state.age).to.equal(42);
          done();
        });

      bloc.dispatchEvent(defaultPeopleBlocEvent);
    });

    it("should update a BloC's state when the method `mapEventToState` returns a Promise", done => {
      Sinon.stub(bloc, 'mapEventToState' as any).callsFake(() => {
        return Promise.resolve({
          firstname: 'qux',
        });
      });

      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'qux'),
          take(1),
        )
        .subscribe(state => {
          expect(state.firstname).to.equal('qux');
          expect(state.lastname).to.equal('bar');
          expect(state.age).to.equal(42);
          done();
        });

      bloc.dispatchEvent(defaultPeopleBlocEvent);
    });

    it("should update a BloC's state when the method `mapEventToState` returns an Observable", done => {
      Sinon.stub(bloc, 'mapEventToState' as any).callsFake(() => {
        return of({
          firstname: 'qux',
        });
      });

      bloc.stream
        .pipe(
          skipWhile(state => state.firstname !== 'qux'),
          take(1),
        )
        .subscribe(state => {
          expect(state.firstname).to.equal('qux');
          expect(state.lastname).to.equal('bar');
          expect(state.age).to.equal(42);
          done();
        });

      bloc.dispatchEvent(defaultPeopleBlocEvent);
    });

    it('should call the delegate method `blocDidCatchError` when the method `mapEventToState` throws an error', done => {
      Sinon.stub(bloc, 'mapEventToState' as any).callsFake(() => {
        throw new Error('unknown error');
      });

      bloc.dispatchEvent(defaultPeopleBlocEvent);

      of(null)
        .pipe(delay(0))
        .subscribe(() => {
          const lastCall = spyonBlocDidCatchError.lastCall;
          const error: Error = lastCall.args[1];

          expect(spyonBlocDidCatchError.called).to.equal(true);
          expect(error.message).to.equal('unknown error');
          done();
        });
    });

    it('should call the delegate method `blocDidCatchError` when the method `mapEventToState` returns a rejected Promise', done => {
      Sinon.stub(bloc, 'mapEventToState' as any).callsFake(() => {
        return Promise.reject(new Error('unknown error'));
      });

      bloc.dispatchEvent(defaultPeopleBlocEvent);

      of(null)
        .pipe(delay(0))
        .subscribe(() => {
          const lastCall = spyonBlocDidCatchError.lastCall;
          const error: Error = lastCall.args[1];

          expect(spyonBlocDidCatchError.called).to.equal(true);
          expect(error.message).to.equal('unknown error');
          done();
        });
    });

    it('should call the delegate method `blocDidCatchError` when the method `mapEventToState` returns an Observable that emit an error', done => {
      Sinon.stub(bloc, 'mapEventToState' as any).callsFake(() => {
        return throwError('unknown error');
      });

      bloc.dispatchEvent(defaultPeopleBlocEvent);

      of(null)
        .pipe(delay(0))
        .subscribe(() => {
          const lastCall = spyonBlocDidCatchError.lastCall;
          const error: Error = lastCall.args[1];

          expect(spyonBlocDidCatchError.called).to.equal(true);
          expect(error.message).to.equal('unknown error');
          done();
        });
    });
  });
});
