import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { SignInEmailPasswordRequest } from 'schema/types';
import { NotFoundError } from 'common/error/NotFound';
import { AuthenticationFailedError } from 'common/error/AuthenticationFailed';

import { AuthEmailPasswordRepository } from './interface/repository';
import { SignInEmailPasswordUseCase } from './interface/usecase';
import { SignInEmailPasswordPresenter } from './interface/presenter';
import { UserRepository } from '../user/__mocks__/UserRepository';

dotenv.config();

export class SignInEmailPasswordInteractor implements SignInEmailPasswordUseCase {
  private authRepository: AuthEmailPasswordRepository;
  private userRepository: UserRepository;
  private presenter: SignInEmailPasswordPresenter;

  constructor(
    authRepository: AuthEmailPasswordRepository,
    userRepository: UserRepository,
    presenter: SignInEmailPasswordPresenter,
  ) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
    this.presenter = presenter;
  }

  public async handle(request: SignInEmailPasswordRequest) {
    const authEntity = await this.authRepository.getByEmail(request.email);
    if (!authEntity) throw new NotFoundError('そのメールアドレスは登録されていません');

    // パスワードがマッチしているか
    const passwordMatched = await authEntity.getPassword().compareWith(request.password);
    if (!passwordMatched) throw new AuthenticationFailedError();

    // 対応する user エンティティを取得
    const userId = authEntity.getUserId().toString();
    const userEntity = await this.userRepository.getById(userId);
    if (!userEntity) throw new NotFoundError('認証結果に対応するユーザが見つかりません');

    // JWT トークンを生成
    const tokenPayload = {
      id: userId,
      roles: userEntity.getRoles().map((role) => role.toString()),
    };
    const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
    const token = jwt.sign(tokenPayload, JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN });

    // TODO: ログイン履歴とか

    this.presenter.output(token, userEntity);
  }
}
