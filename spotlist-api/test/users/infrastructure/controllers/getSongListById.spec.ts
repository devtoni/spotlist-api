import { Request, Response } from 'express';
import BadRequestError from '../../../../src/shared/infrastructure/errors/BadRequest';
import getSongListByIdUseCase, {
  GetSongListByIdUseCase
} from '../../../../src/users/application/GetSongListByIdUseCase';
import getSongListById from '../../../../src/users/infrastructure/controllers/getSongListById';

jest.mock('../../../../src/users/application/GetSongListByIdUseCase.ts');

describe('getSongListById', () => {
  test('Should return a requested song list of a given user', async () => {
    const userId = '123456';
    const listId = '1234';
    const { mocks, controller } = factory({ requestParams: { userId, listId }, userId });

    (getSongListByIdUseCase as jest.Mocked<GetSongListByIdUseCase>).execute.mockResolvedValue({
      listId: '1234',
      songs: []
    });
    await controller();

    expect(mocks.response.json).toHaveBeenCalledWith({ data: { listId: '1234', songs: [] } });
  });

  test('Should validate request params userId with the current userId', async () => {
    const userId = '123456';
    const listId = '1234';
    const { mocks, controller } = factory({
      requestParams: { userId, listId },
      userId: 'anotherUserId'
    });

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
