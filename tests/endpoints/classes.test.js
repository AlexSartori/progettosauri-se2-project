const classes = require('../../endpoints/classes');
const DB = require('../../DinoBase');

const fetch = require('node-fetch');
const fs = require('fs');

const app = require('../../index').app;
const server = require('../../index').server;
const PORT = require('../../index').PORT;
const BASE_URL = `http://localhost:${PORT}/classes`;

beforeAll(() => {
  process.env.TESTING = true;
  fs.writeFileSync(DB.DB_TEST_PATH, JSON.stringify({
    'classes': {},
    'classes_next_id': 0,
    'users': {
      '0': {
        'id': 0,
        'name': 'test_user',
        'mail': 'mail@test.com',
        'password': 'test'
      },
      '1': {
        'id': 1,
        'name': 'other_test_user',
        'mail': 'other_mail@test.com',
        'password': 'test'
      }
    },
    'users_next_id': 2
  }));
});

afterAll(() => {
  fs.writeFileSync(DB.DB_TEST_PATH, '{}');
  server.close();
});

test('register_endpoints', () => {
  expect.assertions(1);
  return fetch(BASE_URL, {method: 'POST'})
  .then(res => {
    expect(res.status).toEqual(400);
  });
});

test('successful_create_class', () => {
  expect.assertions(6);
  new_class = {
    'name': 'Test class',
    'users': [1]
  };
  return fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(new_class),
    headers: {
      'Content-Type': 'application/json',
      'user': 0
    }
  })
  .then(res => {
    expect(res.status).toEqual(201);
    DB.edit_data(data => {
      obj = data.classes[0];
      expect(obj.id).toEqual(0);
      expect(obj.name).toEqual('Test class');
      expect(obj.users.length).toEqual(1);
      expect(data.users[obj.users[0]].name).toEqual('other_test_user');
      expect(obj.creator).toEqual(0);
    });
  });
});

test('failing_create_class_no_name', () => {
  expect.assertions(1);
  new_class = {
    'users': [1]
  };
  return fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(new_class),
    headers: {
      'Content-Type': 'application/json',
      'user': '0'
    }
  })
  .then(res => {
    expect(res.status).toEqual(400);
  });
});

test('failing_create_class_no_creator', () => {
  expect.assertions(1);
  new_class = {
    'name': 'test',
    'users': [1]
  };
  return fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(new_class),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    expect(res.status).toEqual(400);
  });
});

test('failing_create_class_no_name_string', () => {
  expect.assertions(1);
  new_class = {
    'name': [],
    'users': [1]
  };
  return fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(new_class),
    headers: {
      'Content-Type': 'application/json',
      'user': 0
    }
  })
  .then(res => {
    expect(res.status).toEqual(400);
  });
});
