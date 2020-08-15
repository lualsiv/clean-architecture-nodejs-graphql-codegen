import { DoneTodoRequest } from 'schema/types';
import { NotFoundError } from 'common/error/NotFound';

import { TodoRepository } from './interface/repository';
import { DoneTodoUseCase } from './interface/usecase';
import { DoneTodoPresenter } from './interface/presenter';

export class DoneTodoInteractor implements DoneTodoUseCase {
  private repository: TodoRepository;
  private presenter: DoneTodoPresenter;

  constructor(repository: TodoRepository, presenter: DoneTodoPresenter) {
    this.repository = repository;
    this.presenter = presenter;
  }

  public async handle(request: DoneTodoRequest) {
    const todoEntity = await this.repository.getById(request.id);
    if (!todoEntity) throw new NotFoundError();

    todoEntity.done();

    await this.repository.update(todoEntity);

    this.presenter.output(todoEntity);
  }
}