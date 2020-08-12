import { Connection } from 'typeorm';
import { CreateTodoRequest, Todo, TodoStatus } from 'schema/types';
import { TodoEntity } from 'domain-model/src/todo/TodoEntity';

import { TodoRepository as TodoRepositoryIF } from '../../usecase/todo/repository.interface';
import { Todo as OrmTodo } from '../../infrastructure/typeorm/entity/Todo';

export class TodoRepository implements TodoRepositoryIF {
  private dbConnection: Connection;

  constructor(dbConnection: Connection) {
    this.dbConnection = dbConnection;
  }

  public async getById(id: string) {
    const repository = this.dbConnection.getRepository(OrmTodo);
    const result = await repository.findOne(id);
    if (!result) return null;

    const entity = new TodoEntity((result as unknown) as Todo);
    return entity;
  }

  public async create(request: CreateTodoRequest) {
    const todo = new OrmTodo();
    todo.ownerId = +request.ownerId;
    todo.title = request.title;
    todo.status = TodoStatus.Undone;
    if (request.dueDate) todo.dueDate = request.dueDate;

    const repository = this.dbConnection.getRepository(OrmTodo);
    const result = await repository.save(todo);

    const entity = new TodoEntity((result as unknown) as Todo);
    return entity;
  }
}
