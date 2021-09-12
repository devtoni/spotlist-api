import { UsersRepository } from '../../domain/UsersRepository';
import { AuthenticatedUser } from '../../domain/AuthenticatedUser';

class InMemoryUsersRepository implements UsersRepository {
  constructor(private usersDb: AuthenticatedUser[]) {}

  async find(username: string, password: string): Promise<AuthenticatedUser | null> {
    const authenticatedUser = this.usersDb.find(
      (user) => user.name === username && user.password === password
    );
    return authenticatedUser || null;
  }
}

export { InMemoryUsersRepository };
