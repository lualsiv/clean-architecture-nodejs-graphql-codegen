import { GetUserInteractor } from '../GetUser';
import { UserRepository } from '../__mocks__/UserRepository';
import { MockGetUserPresenter } from '../__mocks__/MockUserPresenter';

/**
 * ユーザを1名作成しておく
 */
const setup = async () => {
  // repository
  const repository = new UserRepository();
  const userEntity = await repository.create({ email: 'target@email.com' });
  const userId = userEntity.getID().toString();

  // interactor
  const presenter = new MockGetUserPresenter();
  const interactor = new GetUserInteractor(repository, presenter);

  return { userId, interactor, presenter };
};

describe('GetUserInteractor', () => {
  it('リクエストを処理し、ユーザを取得できた', async () => {
    const { userId, interactor, presenter } = await setup();

    await interactor.handle(userId);

    // response として request で指定したデータが得られた
    const response = presenter.getResponse();
    expect(response?.id).toBe(userId);
  });

  it('存在しないIDを指定したため、nullが返された', async () => {
    const { interactor, presenter } = await setup();

    await interactor.handle('99999');

    // response として null が得られた
    const response = presenter.getResponse();
    expect(response).toBeNull();
  });
});
