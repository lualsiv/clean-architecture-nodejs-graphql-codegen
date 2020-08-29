import { Connection, Repository } from 'typeorm';
import { User, CreateUserRequest } from 'schema';
import { UserEntity, RoleTypes, UserRepository as UserRepositoryIF } from 'domain-model';

import { User as OrmUser, OrmUserFactory } from '../entity/User';

export class UserRepository implements UserRepositoryIF {
  private dbConnection: Connection;
  private repository: Repository<OrmUser>;

  constructor(dbConnection: Connection) {
    this.dbConnection = dbConnection;
    this.repository = this.dbConnection.getRepository(OrmUser);
  }

  public async getById(id: string) {
    const result = await this.repository.findOne(id);
    if (!result) return null;

    const entity = new UserEntity((result as unknown) as User);
    return entity;
  }

  public async create(request: CreateUserRequest) {
    const user = new OrmUser(request.email, [RoleTypes.Anonymous]);
    const repository = this.dbConnection.getRepository(OrmUser);
    const result = await repository.save(user);

    const entity = new UserEntity((result as unknown) as User);
    return entity;
  }

  public async update(userEntity: UserEntity) {
    const todo = OrmUserFactory.fromEntity(userEntity);
    const saved = await this.repository.save(todo);

    return OrmUserFactory.toEntity(saved);
  }
}