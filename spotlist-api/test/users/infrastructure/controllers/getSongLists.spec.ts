import { Request, Response } from 'express';
import BadRequestError from '../../../../src/shared/infrastructure/errors/BadRequest';
import getSongListsUseCase, {
  GetSongListsUseCase
} from '../../../../src/users/application/GetSongListsUseCase';
import getSongLists from '../../../../src/users/infrastructure/controllers/getSongLists';

jest.mock('../../../../src/users/application/GetSongListsUseCase.ts');

describe('getSongLists', () => {
  test('Should return the song lists of a given user', async () => {
    const userId = '123456';
    const { mocks, controller } = factory({ requestParams: userId, userId });

    (getSongListsUseCase as jest.Mocked<GetSongListsUseCase>).execute.mockResolvedValue([
      { listId: '1234', songs: [] }
    ]);
    await controller();

    expect(mocks.response.json).toHaveBeenCalledWith({ data: [{ listId: '1234', songs: [] }] });
  });

  test('Should validate request params userId with the current userId', async () => {
    const userId = '123456';
    const { mocks, controller } = factory({ requestParams: userId, userId: 'anotherUserId' });

    await controller();

    expect(mocks.next).toHaveBeenCalledWith(new BadRequestError('Invalid parameters'));
  });
});

const factory = ({ requestParams, userId }: any) => {
  const requestMock = {
    params: { userId: requestParams }
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
