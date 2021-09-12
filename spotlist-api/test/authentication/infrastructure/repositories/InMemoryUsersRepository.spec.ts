import { InMemoryUsersRepository } from '../../../../src/authentication/infrastructure/repositories/InMemoryUsersRepository';

describe('InMemoryUsersRepository', () => {
  test('Should return an authenticated user', async () => {
    const userCredentials = { username: 'toni', password: '123456' };
    const fakeUsersDb = [{ name: 'toni', password: '123456', id: '1' }];
    const repository = new InMemoryUsersRepository(fakeUsersDb);

    const response = await repository.find(userCredentials.username, userCredentials.password);

    expect(response).toEqual({ name: 'toni', password: '123456', id: '1' });
  });

  test('Should return null in case a user was not found', async () => {
    const userCredentials = { username: 'toniii', password: '123456' };
    const fakeUsersDb = [{ name: 'toni', password: '123456', id: '1' }];
    const repository = new InMemoryUsersRepository(fakeUsersDb);

    const response = await repository.find(userCredentials.username, userCredentials.password);

    expect(response).toEqual(null);
  });
});
