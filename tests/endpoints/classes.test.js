const classes = require('../../endpoints/classes');

const fetch = require('node-fetch');

const app = require('../../index').app
const server = require('../../index').server
const PORT = process.env.PORT || require('../../index').PORT;
const BASE_URL = `http://localhost:${PORT}/classes`;

test('register_endpoints', () => {
  expect.assertions(1);
  return fetch(BASE_URL, {method: 'POST'})
  .then(res => {
    expect(res.status).toEqual(400);
  });
});

test('create_class', () => {

});

afterAll(() => server.close());
