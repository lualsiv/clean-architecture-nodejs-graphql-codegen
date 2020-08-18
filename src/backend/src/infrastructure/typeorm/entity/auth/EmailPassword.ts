import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import {
  AuthEmailPasswordEntity,
  AuthEmailPasswordDto,
} from 'domain-model/src/entity/auth/AuthEmailPasswordEntity';

import { User } from '../User';

@Entity('authEmailPasswords')
export class AuthEmailPassword {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  email: string;

  @Column()
  passwordEncrypted: string;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}

export class OrmAuthEmailPasswordFactory {
  public static toSchema(auth: AuthEmailPassword): AuthEmailPasswordDto {
    return {
      email: auth.email,
      passwordEncrypted: auth.passwordEncrypted,
      userId: `${auth.userId}`,
    };
  }

  public static toEntity(auth: AuthEmailPassword): AuthEmailPasswordEntity {
    const schema = OrmAuthEmailPasswordFactory.toSchema(auth);
    return new AuthEmailPasswordEntity(schema);
  }
}