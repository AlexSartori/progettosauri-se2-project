const fetch = require('node-fetch');

const app = require('./index').app;
const PORT = process.env.PORT || require('./index').PORT;
const URL = `http://localhost:${PORT}/`;

test('Hello World test', () => {
  expect.assertions(2);
  return fetch(URL).then(res => {
    expect(res.status).toEqual(200);
    return res.text();
  }).then(text => expect(text).toEqual('Hello World!'));
});
