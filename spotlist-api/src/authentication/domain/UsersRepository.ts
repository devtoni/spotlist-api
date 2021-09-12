import { AuthenticatedUser } from './AuthenticatedUser';

interface UsersRepository {
  find(username: string, password: string): Promise<AuthenticatedUser | null>;
}

export { UsersRepository };
