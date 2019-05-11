import { BidirectionalBloc, BlocEvent } from '@tbloc/core';
import { Observable, Subject } from 'rxjs';
import { ObjectSchema, ValidationError } from 'yup';

import { FormBlocStateBuilder } from './form-bloc-state.builder';
import { FormBlocDelegate } from './form-bloc.delegate';
import { FormBlocState, FormFieldState } from './form-bloc.state';

export abstract class FormBloc<
  M extends object,
  E extends BlocEvent,
  S extends FormBlocState
> extends BidirectionalBloc<E, S, FormBlocDelegate<M, E, S>> {
  public schemaValidator: ObjectSchema<M>;

  protected stateBuilder: FormBlocStateBuilder<S>;

  public get modelStream(): Observable<M> {
    return this.modelController.asObservable();
  }

  protected modelController: Subject<M> = new Subject<M>();

  constructor(initialState?: S, builder?: FormBlocStateBuilder<S>) {
    super(initialState, builder);
  }

  public dispose(): void {
    super.dispose();
    this.modelController!.complete();
  }

  protected delegateRespondsToMethod(
    name: keyof FormBlocDelegate<M, E, S>,
  ): boolean {
    return super.delegateRespondsToMethod(name);
  }

  protected async mapEventToState(event: E, currentState: S) {
    const currentModel = this.mapStateToModel(currentState);
    const candidateModel = this.mapEventToModel(event, currentModel);

    let errors: ValidationError[] | null = null;
    let model: M;

    try {
      model = await this.schemaValidator.validate(candidateModel, {
        abortEarly: false,
      });
    } catch (validationError) {
      errors = (validationError as ValidationError).inner;
      model = (validationError as ValidationError).value;
    }

    if (!errors && this.delegateRespondsToMethod('blocDidValidateModel')) {
      // @ts-ignore -- `delegate` is safe here,
      // thanks to`delegateRespondsToMethod`
      delegateEvent = this.delegate.blocDidValidateModel(this, event, model);
    }

    this.modelController.next(model);

    return this.mapModelToState(model, errors);
  }

  protected addErrorsToState(state: S, errors?: ValidationError[]) {
    if (errors) {
      for (const error of errors) {
        const path = error.path;
        const fieldControl: FormFieldState = state[path];
        fieldControl.errors.push(error);
        fieldControl.valid = false;
      }
    }
  }

  protected abstract mapEventToModel(event: E, currentModel: M): M;

  protected abstract mapStateToModel(state: S): M;

  protected abstract mapModelToState(
    model: M,
    errors?: ValidationError[] | null,
  ): S;
}