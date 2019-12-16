import { BidirectionalBloc, IBlocEvent } from '@tbloc/core';
import { Observable, Subject } from 'rxjs';
import { ObjectSchema, ValidationError } from 'yup';

import { FormBlocStateBuilder } from './form-bloc-state.builder';
import { IFormBlocDelegate } from './interfaces/form-bloc-delegate.interface';
import { IFormBlocState } from './interfaces/form-bloc-state.interface';

export abstract class FormBloc<
  M extends object,
  E extends IBlocEvent,
  S extends IFormBlocState
> extends BidirectionalBloc<E, S, IFormBlocDelegate<M, E, S>> {
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

  protected delegateRespondsToMethod(
    name: keyof IFormBlocDelegate<M, E, S>,
  ): boolean {
    return super.delegateRespondsToMethod(name);
  }

  protected async mapEventToState(event: E, currentState: S): Promise<S> {
    const currentModel = this.mapStateToModel(currentState);
    const candidateModel = this.mapEventToModel(event, currentModel);

    let errors: ValidationError[] | null = null;
    let model: M;

    try {
      model = await this.schemaValidator.validate(candidateModel, {
        abortEarly: false,
      });
    } catch (validationError) {
      if (validationError.inner.length) {
        errors = (validationError as ValidationError).inner;
      } else {
        errors = [validationError];
      }

      model = (validationError as ValidationError).value;
    }

    if (!errors) {
      this.modelController.next(model);

      if (this.delegateRespondsToMethod('blocDidValidateModel')) {
        // @ts-ignore -- `delegate` is safe here
        this.delegate.blocDidValidateModel(this, event, model);
      }
    }

    return this.mapModelToState(model, errors);
  }

  protected abstract mapEventToModel(event: E, currentModel: M): M;

  protected abstract mapStateToModel(state: S): M;

  protected abstract mapModelToState(
    model: M,
    errors?: ValidationError[] | null,
  ): S;
}
