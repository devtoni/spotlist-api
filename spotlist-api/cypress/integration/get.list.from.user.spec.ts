const apiUrl = `${Cypress.env('apiUrl')}`;
import users from '../fixtures/users.json';

describe('Get specific List from User Spec', () => {
  const user: any = users[1];
  const addListBasePath: string = `/users/${user['id']}/lists`;
  let getListByIdBasePath: string;
  let listId: string;

  const addListsPayload: any = {
    list: {
      songs: [
        {
          artist: 'artist1',
          title: 'title1'
        },
        {
          artist: 'artist2',
          title: 'title2'
        }
      ]
    }
  };

  before(() => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}${addListBasePath}`,
      body: addListsPayload,
      auth: {
        user: user['name'],
        password: user['password']
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      listId = response.body.listId;

      addListsPayload.list.listId = listId;
      getListByIdBasePath = `/users/${user['id']}/lists/${listId}`;
    });
  });

  it('should return a list if the id and user are correct', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}${getListByIdBasePath}`,
      auth: {
        user: user['name'],
        password: user['password']
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.an('array');
      expect(response.body).to.deep.equal(addListsPayload.list);
    });
  });

  it('should throw 400 if list id does not exist', () => {
    const getListByIdBasePath = `/users/${user['id']}/lists/111111`;

    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}${getListByIdBasePath}`,
      auth: {
        user: user['name'],
        password: user['password']
      }
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should throw 401 if user is not the owner', () => {
    const user: object = users[2];

    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}${getListByIdBasePath}`,
      auth: {
        user: user['name'],
        password: user['password']
      }
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('should throw 401 if user is does not exist', () => {
    const user: object = users[0];

    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}${getListByIdBasePath}`,
      auth: {
        user: user['name'],
        password: user['password']
      }
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
