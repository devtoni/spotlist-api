import { AuthenticatedUser } from "../domain/AuthenticatedUser";
import { UsersRepository } from "../domain/UsersRepository";
import { InMemoryUsersRepository } from "../infrastructure/repositories/InMemoryUsersRepository";
import usersDb from '../../../../data/users.json';

class LoginUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute(username: string, password: string): Promise<AuthenticatedUser> {
        const authenticatedUser = await this.usersRepository.find(username, password);

        if (!authenticatedUser) {
           throw new Error('User not found');
        }

        return authenticatedUser;
    } 
}

export default new LoginUseCase(new InMemoryUsersRepository(usersDb));

export { LoginUseCase };