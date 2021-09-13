import { Request, Response } from 'express';
import BadRequestError from '../../../../src/shared/infrastructure/errors/BadRequest';
import addSongToASongList from '../../../../src/users/infrastructure/controllers/addSongToASongList';
import addSongToASongListUseCase from '../../../../src/users/application/AddSongToASongListUseCase';
import inMemoryUserSongListsRepository, { InMemoryUserSongListsRepository } from '../../../../src/users/infrastructure/repositories/InMemoryUserSongListsRepository'

jest.mock('../../../../src/users/infrastructure/repositories/InMemoryUserSongListsRepository.ts');

describe('addSongToASongList', () => {
  test('Should respond with the newly created song', async () => {
    const { controller, mocks } = factory({
      requestParams: { userId: '123456', listId: '1234' },
      requestBody: { song: { artist: 'an artist', title: 'a title' } },
      userId: '123456'
    });
    (inMemoryUserSongListsRepository as jest.Mocked<InMemoryUserSongListsRepository>).findById.mockResolvedValue({listId: '1234', songs: []})
    
    await addSongToASongListUseCase.execute('123456', '234', {
      artist: 'an artist',
      title: 'a title'
    });

    await controller();

    expect(mocks.response.json).toHaveBeenCalledWith({ data: { artist: 'an artist', title: 'a title' } });
  });

  test('Should call to the next route match when a retrieved userId from request params is different that the current authorized user', async () => {
    const { controller, mocks } = factory({
      requestParams: { userId: '12345', listId: '1234' },
      requestBody: { list: { songs: [] } },
      userId: '123455'
    });

    await controller();

    expect(mocks.next).toHaveBeenCalledWith(new BadRequestError('Invalid parameters'));
  });

  test('Should call to the next route match when request body comes without a song attribute', async () => {
    const { controller, mocks } = factory({
      requestParams: { userId: '123456', listId: '1234' },
      requestBody: {},
      userId: '123456'
    });

    await controller();

    expect(mocks.next).toHaveBeenCalledWith(new BadRequestError('Invalid parameters'));
  });

  test('Should call to the next route match when request body comes with a malformed song', async () => {
    const { controller, mocks } = factory({
      requestParams: { userId: '123456', listId: '1234' },
      requestBody: { artist: 'some artist' },
      userId: '123456'
    });

    await controller();

    expect(mocks.next).toHaveBeenCalledWith(new BadRequestError('Invalid parameters'));
  });

  test('Should call to the next route match when the given listId from request params is not found for the current user', async () => {
    const { controller, mocks } = factory({
      requestParams: { userId: '123456', listId: '1234' },
      requestBody: { artist: 'some artist' },
      userId: '123456'
    });

    await controller();

    expect(mocks.next).toHaveBeenCalledWith(new BadRequestError('Invalid parameters'));
  });
});

const factory = ({ requestParams, requestBody, userId }: any) => {
  const requestMock = {
    params: requestParams,
    body: requestBody
  } as unknown as Request;

  const responseMock = {
    json: jest.fn(),
    locals: { userId }
  } as unknown as Response;

  const nextMock = jest.fn();

  return {
    controller: () => addSongToASongList(requestMock, responseMock, nextMock),
    mocks: {
      next: nextMock,
      response: responseMock
    }
  };
};
