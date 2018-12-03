const tasks = require('../../endpoints/tasks');
const DB = require('../../DinoBase');

const fetch = require('node-fetch');
const fs = require('fs');

const app = require('../../index').app;
const server = require('../../index').server;
const PORT = require('../../index').PORT;
const BASE_URL = `http://localhost:${PORT}/tasks`;

beforeAll(() => {
  fs.writeFileSync(DB.DB_PATH, JSON.stringify({
    'tasks': {},
    'tasks_next_id': 0,
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
  fs.writeFileSync(DB.DB_PATH, '{}');
  server.close();
});


// POST /tasks
test('Successful create task open answer', () => {
  expect.assertions(4);
  new_task = {
    'text': 'Question1',
    'answers': []
  };
  return fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(new_task),
    headers: {
      'Content-Type': 'application/json',
      'user': 0
    }
  })
  .then(res => {
    expect(res.status).toEqual(201);

    DB.edit_data(data => {
      obj = data.tasks[0];
      expect(obj.id).toEqual(0);
      expect(obj.text).toEqual('Question1');
      expect(obj.answers.length).toEqual(undefined);
    });
  });
});

test('Successful create task multiple choice answer', () => {
  expect.assertions(5);
  new_task = {
    'text': 'Question2',
    'answers': [{'text':'answer1','correct': true},
		            {'text':'answer2','correct': false}]
  };
  return fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(new_task),
    headers: {
      'Content-Type': 'application/json',
      'user': 0
    }
  })
  .then(res => {
    expect(res.status).toEqual(201);

    DB.edit_data(data => {
      obj = data.tasks[1];
      expect(obj.id).toEqual(1);
      expect(obj.text).toEqual('Question2');
      expect(obj.answers[0]).toEqual({'text':'answer1','correct': true, 'id':0});
      expect(obj.answers[1]).toEqual({'text':'answer2','correct': false, 'id':1});
    });
  });
});

test('Fail create task multiple choice answer bad format', () => {
  expect.assertions(1);
  new_task = {
    'text': 'Question1',
    'answers': [{'text':'answer1','correct': true}]
  };
  return fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(new_task),
    headers: {
      'Content-Type': 'application/json',
      'user': 0
    }
  })
  .then(res => {
    expect(res.status).toEqual(400);
  });
});

test('Fail create task multiple choice answer bad format', () => {
  expect.assertions(1);
  new_task = {
    'text': 'Question1',
    'answers': [{'text':'answer1','correct': true},
		            {'text':'answer2','correccct': false}]
  };
  return fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(new_task),
    headers: {
      'Content-Type': 'application/json',
      'user': 0
    }
  })
  .then(res => {
    expect(res.status).toEqual(400);
  });
});

test('Fail create task no text', () => {
  expect.assertions(1);
  new_task = {
    'answers': []
  };
  return fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(new_task),
    headers: {
      'Content-Type': 'application/json',
      'user': 0
    }
  })
  .then(res => {
    expect(res.status).toEqual(400);
  });
});

test('Fail create task no user provided', () => {
  expect.assertions(1);
  new_task = {
    'text' : 'Question1',
    'answers': []
  };
  return fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(new_task),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    expect(res.status).toEqual(400);
  });
});
