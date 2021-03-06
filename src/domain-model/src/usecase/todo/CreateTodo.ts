import { NotFoundError } from 'common';

import { TodoRepository } from './interface/repository';
import { CreateTodoInputData, CreateTodoUseCase } from './interface/usecase';
import { CreateTodoOutputData, CreateTodoPresenter } from './interface/presenter';
import { UserRepository } from '../user/interface/repository';

export class CreateTodoInteractor implements CreateTodoUseCase {
  private todoRepository: TodoRepository;
  private userRepository: UserRepository;
  private presenter: CreateTodoPresenter;

  constructor(
    todoRepository: TodoRepository,
    userRepository: UserRepository,
    presenter: CreateTodoPresenter,
  ) {
    this.todoRepository = todoRepository;
    this.userRepository = userRepository;
    this.presenter = presenter;
  }

  public async handle(request: CreateTodoInputData) {
    // 対応する user エンティティを取得
    const userEntity = await this.userRepository.getById(request.ownerId);
    if (!userEntity) throw new NotFoundError('指定したオーナーが見つかりません');

    // 新しい TODO を生成
    const todoEntity = await this.todoRepository.create(request);

    const outputData: CreateTodoOutputData = { todo: todoEntity.toDto() };
    this.presenter.output(outputData);
  }
}
