import { BidirectionalBloc, IBlocEvent } from '@tbloc/core';
import { from, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ObjectSchema, ValidationError } from 'yup';

import { FormBlocStateBuilder } from './form-bloc-state.builder';
import { IFormBlocState } from './interfaces/form-bloc-state.interface';

export abstract class FormBloc<
  M extends object,
  E extends IBlocEvent,
  S extends IFormBlocState
> extends BidirectionalBloc<E, S> {
  public schemaValidator: ObjectSchema<M>;
  protected modelController: Subject<M> = new Subject<M>();
  protected stateBuilder: FormBlocStateBuilder<S>;

  public get modelStream(): Observable<M> {
    return this.modelController.asObservable();
  }

  constructor(initialState?: S, builder?: FormBlocStateBuilder<S>) {
    super(initialState, builder);
  }

  public dispose(): void {
    super.dispose();
    this.modelController.complete();
  }

  protected mapEventToState(event: E, currentState: S): Observable<S> {
    return this.mapStateToModel(currentState).pipe(
      switchMap(currentModel => {
        return this.mapEventToModel(event, currentModel);
      }),
      switchMap(candidateModel => {
        return from(
          this.schemaValidator.validate(candidateModel, {
            abortEarly: false,
          }),
        ).pipe(
          map((nextModel: M) => {
            return [nextModel, null];
          }),
        );
      }),
      catchError((error: ValidationError) => {
        if (error.inner.length) {
          return of([error.value as M, error.inner]);
        }
        return of([error.value as M, [error]]);
      }),
      switchMap(([nextModel, errors]: [M, ValidationError[]]) => {
        if (!errors) {
          this.modelController.next(nextModel);
        }

        return this.mapModelToState(nextModel, errors);
      }),
    );
  }

  protected abstract mapEventToModel(event: E, currentModel: M): Observable<M>;

  protected abstract mapStateToModel(state: S): Observable<M>;

  protected abstract mapModelToState(
    model: M,
    errors?: ValidationError[],
  ): Observable<S>;
}
