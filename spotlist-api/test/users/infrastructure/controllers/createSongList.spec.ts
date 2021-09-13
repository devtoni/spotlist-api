import { Request, Response } from 'express';
import BadRequestError from '../../../../src/shared/infrastructure/errors/BadRequest';
import UnauthorizedError from '../../../../src/shared/infrastructure/errors/UnauthorizedError';
import createSongList from '../../../../src/users/infrastructure/controllers/createSongList';

describe('createSongList', () => {
  test('Should respond with the newly created song list', async () => {
    const { controller, mocks } = factory({
      requestParams: '123456',
      requestBody: { list: { songs: [] } },
      userId: '123456'
    });

    await controller();

    expect(mocks.response.json).toHaveBeenCalledWith({ listId: expect.any(String), songs: [] });
  });

  test('Should call to the next route match with an unauthorized error when a retrieved userId from request params is different that the current authorized user', async () => {
    const { controller, mocks } = factory({
      requestParams: '',
      requestBody: { list: { songs: [] } },
      userId: '123455'
    });

    await controller();

    expect(mocks.next).toHaveBeenCalledWith(
      new UnauthorizedError('User is not the one authenticated')
    );
  });

  test('Should call to the next route match with a bad request error when request body comes without list attribute', async () => {
    const { controller, mocks } = factory({
      requestParams: '123455',
      requestBody: {},
      userId: '123455'
    });

    await controller();

    expect(mocks.next).toHaveBeenCalledWith(new BadRequestError('Invalid parameters'));
  });

  test('Should call to the next route match with a bad request error when request body list.songs are not correct', async () => {
    const { controller, mocks } = factory({
      requestParams: '123455',
      requestBody: { list: { songs: [{ badProp: '' }] } },
      userId: '123455'
    });

    await controller();

    expect(mocks.next).toHaveBeenCalledWith(new BadRequestError('Invalid parameters'));
  });
});

const factory = ({ requestParams, requestBody, userId }: any) => {
  const requestMock = {
    params: { userId: requestParams },
    body: requestBody
  } as unknown as Request;

  const responseMock = {
    json: jest.fn(),
    locals: { userId }
  } as unknown as Response;

  const nextMock = jest.fn();

  return {
    controller: () => createSongList(requestMock, responseMock, nextMock),
    mocks: {
      next: nextMock,
      response: responseMock
    }
  };
};
