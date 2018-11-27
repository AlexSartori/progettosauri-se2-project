const conc = require('../endpoints/users').create_user;
const fs = require('fs');
const DB = require('../DinoBase');
const fetch = require('node-fetch');
const server = require('../index').server;

beforeAll(() => {
  process.env.TESTING = true;
});

afterAll(() => {
  fs.writeFileSync(DB.DB_TEST_PATH, '{}');
  server.close();
});

test('create_user invalid parameters', () => {
    expect.assertions(1);
    return fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: '{"name": "francesco"}'
    }).then(response => {
        expect(response.status).toEqual(400);
        return response.status;
    }).catch(response => {
        return response.status;
    });
});

test('create_user valid parameters', () => {
    expect.assertions(1);
    return fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: '{"name": "testname", "surname": "testsurname", "email": "mail@test.test", "password": "testpwd"}'
    }).then(response => {
        expect(response.status).toEqual(201);
        return response.status;
    }).catch(response => {
        return response.status;
    });
});
