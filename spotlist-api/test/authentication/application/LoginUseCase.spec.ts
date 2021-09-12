import { LoginUseCase } from '../../../src/authentication/application/LoginUseCase';
import { InMemoryUsersRepository } from '../../../src/authentication/infrastructure/repositories/InMemoryUsersRepository';

describe('LoginUseCase', () => {
  test('Should return an authenticated user', async () => {
    const userCredentials = { username: 'toni', password: '123456' };
    const fakeUsersDb = [{ name: 'toni', password: '123456', id: '1' }];
    const repository = new InMemoryUsersRepository(fakeUsersDb);
    const loginUseCase = new LoginUseCase(repository);

    const response = await loginUseCase.execute(userCredentials.username, userCredentials.password);

    expect(response).toEqual({ name: 'toni', password: '123456', id: '1' });
  });

  test('Should throw a user not found error when a given username is not found', async () => {
    const userCredentials = { username: 'touuuni', password: '123456' };
    const fakeUsersDb = [{ name: 'toni', password: '123456', id: '1' }];
    const repository = new InMemoryUsersRepository(fakeUsersDb);
    const loginUseCase = new LoginUseCase(repository);

    await expect(
      loginUseCase.execute(userCredentials.username, userCredentials.password)
    ).rejects.toThrow('User not found');
  });

  test('Should throw a user not found error when a given password of a username is not found ', async () => {
    const userCredentials = { username: 'toni', password: '12345688' };
    const fakeUsersDb = [{ name: 'toni', password: '123456', id: '1' }];
    const repository = new InMemoryUsersRepository(fakeUsersDb);
    const loginUseCase = new LoginUseCase(repository);

    await expect(
      loginUseCase.execute(userCredentials.username, userCredentials.password)
    ).rejects.toThrow('User not found');
  });
});
