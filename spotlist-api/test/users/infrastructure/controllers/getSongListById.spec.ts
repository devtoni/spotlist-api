import { Request, Response } from 'express';
import BadRequestError from '../../../../src/shared/infrastructure/errors/BadRequest';
import UnauthorizedError from '../../../../src/shared/infrastructure/errors/UnauthorizedError';
import getSongListByIdUseCase, {
  GetSongListByIdUseCase
} from '../../../../src/users/application/GetSongListByIdUseCase';
import getSongListById from '../../../../src/users/infrastructure/controllers/getSongListById';

jest.mock('../../../../src/users/application/GetSongListByIdUseCase.ts');

describe('getSongListById', () => {
  test('Should return a requested song list of a given user', async () => {
    const request = { userId: '123456', listId: '1234' };
    const { mocks, controller } = factory({ requestParams: request, userId: request.userId });

    (getSongListByIdUseCase as jest.Mocked<GetSongListByIdUseCase>).execute.mockResolvedValue({
      listId: request.listId,
      songs: []
    });
    await controller();

    expect(mocks.response.json).toHaveBeenCalledWith({ listId: request.listId, songs: [] });
  });

  test('Should call to the next route match with an unauthorized error when a retrieved userId from request params is different that the current authorized user', async () => {
    const request = { userId: '123456', listId: '1234' };
    const { mocks, controller } = factory({
      requestParams: request,
      userId: 'anotherUserId'
    });

    await controller();

    expect(mocks.next).toHaveBeenCalledWith(
      new UnauthorizedError('User is not the one authenticated')
    );
  });

  test('Should call to the next route match with an bad request error when a the request listId of an userId is not found', async () => {
    const request = { userId: '123456', listId: '1234' };
    const { mocks, controller } = factory({
      requestParams: request,
      userId: request.userId
    });

    (getSongListByIdUseCase as jest.Mocked<GetSongListByIdUseCase>).execute.mockRejectedValue(
      new Error('Song list not found')
    );
    await controller();

    expect(mocks.next).toHaveBeenCalledWith(new BadRequestError('Invalid parameters'));
  });
});

const factory = ({ requestParams, userId }: any) => {
  const requestMock = {
    params: requestParams
  } as unknown as Request;

  const responseMock = {
    json: jest.fn(),
    locals: { userId }
  } as unknown as Response;

  const nextMock = jest.fn();

  return {
    controller: () => getSongListById(requestMock, responseMock, nextMock),
    mocks: {
      next: nextMock,
      response: responseMock
    }
  };
};
