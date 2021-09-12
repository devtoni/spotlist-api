import { Request, Response } from 'express';
import loginUseCase, {
  LoginUseCase
} from '../../../../src/authentication/application/LoginUseCase';
import isUserAuthorized from '../../../../src/authentication/infrastructure/middlewares/isUserAuthorized';
import UnauthorizedError from '../../../../src/shared/infrastructure/errors/UnauthorizedError';

jest.mock('../../../../src/authentication/application/LoginUseCase.ts');

describe('isUserAuthorized', () => {
  test('Should allow pass the request when user is authorized', async () => {
    const headers = {
      authorization: 'Basic SmhvbiBTbWl0aDp1bnNlY3VyZWRwYXNzd29yZDEyMzQ='
    };
    const { callMiddleware, mocks, services } = factory(headers);

    const expectedUser = {
      name: 'toni',
      password: '123456',
      id: '1'
    };
    services.loginUseCase.execute.mockResolvedValueOnce(expectedUser);
    await callMiddleware();

    expect(mocks.response.locals.userId).toEqual(expectedUser.id);
    expect(mocks.next).toHaveBeenCalledWith();
  });

  test('Should set an unauthorized error when authorization header is not found', async () => {
    const headers = {};
    const { callMiddleware, mocks } = factory(headers);

    await callMiddleware();

    expect(mocks.next).toHaveBeenCalledWith(
      new UnauthorizedError('User is not the one authenticated')
    );
  });

  test('Should set an unauthorized error when authorization header is mal formed', async () => {
    const headers = {
      authorization: 'Bearer ..'
    };
    const { callMiddleware, mocks } = factory(headers);

    await callMiddleware();

    expect(mocks.next).toHaveBeenCalledWith(
      new UnauthorizedError('User is not the one authenticated')
    );
  });

  test('Should set an unauthorized error when authorization credentials are not correct', async () => {
    const headers = {
      authorization: 'Basic dG9uaTpydWl6'
    };
    const { callMiddleware, mocks, services } = factory(headers);

    services.loginUseCase.execute.mockRejectedValue(new Error('User not found'));
    await callMiddleware();

    expect(mocks.next).toHaveBeenCalledWith(new UnauthorizedError('User not found'));
  });
});

const factory = (customHeaders: { authorization?: string }) => {
  const nextFnMock = jest.fn();
  const requestMock = {
    headers: customHeaders
  } as unknown as Request;
  const responseMock = { locals: jest.fn() } as unknown as Response;

  return {
    callMiddleware: () => isUserAuthorized(requestMock, responseMock, nextFnMock),
    services: {
      loginUseCase: loginUseCase as jest.Mocked<LoginUseCase>
    },
    mocks: {
      response: responseMock,
      next: nextFnMock
    }
  };
};
