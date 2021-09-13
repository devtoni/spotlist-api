import { Request, Response } from 'express';
import BadRequestError from '../../../../src/shared/infrastructure/errors/BadRequest';
import UnauthorizedError from '../../../../src/shared/infrastructure/errors/UnauthorizedError';
import getSongListsUseCase, {
  GetSongListsUseCase
} from '../../../../src/users/application/GetSongListsUseCase';
import getSongLists from '../../../../src/users/infrastructure/controllers/getSongLists';

jest.mock('../../../../src/users/application/GetSongListsUseCase.ts');

describe('getSongLists', () => {
  test('Should return the song lists of a given user', async () => {
    const request = { userId: '123456' };
    const listId = '1234';
    const { mocks, controller } = factory({ requestParams: request, userId: request.userId });

    (getSongListsUseCase as jest.Mocked<GetSongListsUseCase>).execute.mockResolvedValue([
      { listId, songs: [] }
    ]);
    await controller();

    expect(mocks.response.json).toHaveBeenCalledWith([{ listId, songs: [] }]);
  });

  test('Should call to the next route match with an unauthorized error when a retrieved userId from request params is different that the current authorized user', async () => {
    const request = { userId: '123456' };
    const { mocks, controller } = factory({ requestParams: request, userId: 'anotherUserId' });

    await controller();

    expect(mocks.next).toHaveBeenCalledWith(
      new UnauthorizedError('User is not the one authenticated')
    );
  });

  test(`Should call to the next route match with an bad request error when there aren't lists for a given userId`, async () => {
    const request = { userId: '123456', listId: '1234' };
    const { mocks, controller } = factory({
      requestParams: request,
      userId: request.userId
    });

    (getSongListsUseCase as jest.Mocked<GetSongListsUseCase>).execute.mockRejectedValue(
      new Error('Song lists not found')
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
    controller: () => getSongLists(requestMock, responseMock, nextMock),
    mocks: {
      next: nextMock,
      response: responseMock
    }
  };
};
