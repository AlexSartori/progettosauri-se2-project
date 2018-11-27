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
      },
      '2': {
        'id': 2,
        'name': 'other_test_user2',
        'mail': 'other_mail2@test.com',
        'password': 'test'
      }
    },
    'users_next_id': 3
  }));
});

afterAll(() => {
  fs.writeFileSync(DB.DB_TEST_PATH, '{}');
  server.close();
});


// POST /classes
test('register_endpoints_post', () => {
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


// GET /classes
test('register_endpoints_get', () => {
  expect.assertions(1);
  return fetch(BASE_URL, {method: 'GET'})
  .then(res => {
    expect(res.status).toEqual(400);
  });
});

test('successful_get_classes', () => {
  expect.assertions(2);
  return fetch(BASE_URL, {
    method: 'GET',
    headers: {'user': 0}
  })
  .then(res => {
    expect(res.status).toEqual(200);
    return res.text();
  })
  .then(res => {
    expect(JSON.parse(res)).toEqual([{name:'Test class',creator:0,users:[1],id:0}]);
  });
});

test('successful_get_classes_empty', () => {
  expect.assertions(2);
  return fetch(BASE_URL, {
    method: 'GET',
    headers: {'user': 1}
  })
  .then(res => {
    expect(res.status).toEqual(200);
    return res.text();
  })
  .then(res => {
    expect(JSON.parse(res)).toEqual([]);
  })
});

// GET /classes/:class_id

/*test('register_endpoints_get', () => {
  expect.assertions(1);
  return fetch(BASE_URL, {method: 'GET'})
  .then(res => {
    expect(res.status).toEqual(400);
  });
});*/

test('successful get class', () => {
  expect.assertions(2);
  return fetch(BASE_URL + '/0', {
    method: 'GET',
    headers: {'user': 0}
  })
  .then(res => {
    expect(res.status).toEqual(200);
    return res.text();
  })
  .then(res => {
    expect(JSON.parse(res)).toEqual([{name:'Test class',creator:0,users:[1],id:0}]);
  });
});

test('fail get class non exist', () => {
  expect.assertions(2);
  return fetch(BASE_URL + '/5', {
    method: 'GET',
    headers: {'user': 0}
  })
  .then(res => {
    expect(res.status).toEqual(404);
    return res.text();
  })
  .then(res => {
    expect(res).toBe(undefined);
  })
});

test('fail get class user not specified', () => {
  expect.assertions(1);
  return fetch(BASE_URL + '/0', {
    method: 'GET'
  })
  .then(res => {
    expect(res.status).toBe(400);
  });
});

test('fail get class user not existing', () => {
  expect.assertions(2);
  return fetch(BASE_URL + '/0', {
    method: 'GET',
    headers: {
      'user': 100
    }
  })
  .then(res => {
    expect(res.status).toBe(400);
       DB.edit_data(data => {
         expect(data.users[100]).toBe(undefined);
      });
  });
});

test('fail get class user no permission', () => {
  expect.assertions(2);
  return fetch(BASE_URL + '/0', {
    method: 'DELETE',
    headers: {
      'user': 2
    }
  })
  .then(res => {
    expect(res.status).toBe(403);
      DB.edit_data(data => {
       expect(data.classes[0].creator).toBe(0);
     });
  });
});


// DELETE classes/:class_id
test('failing delete class user not specified', () => {
  expect.assertions(1);
  return fetch(BASE_URL + '/0', {
    method: 'DELETE'
  })
  .then(res => {
    expect(res.status).toBe(400);
  });
});

test('failing delete class user not existing', () => {
  expect.assertions(2);
  return fetch(BASE_URL + '/0', {
    method: 'DELETE',
    headers: {
      'user': 100
    }
  })
  .then(res => {
    expect(res.status).toBe(400);
       DB.edit_data(data => {
         expect(data.users[100]).toBe(undefined);
      });
  });
});

test('failing delete class not existing', () => {
  expect.assertions(2);
  return fetch(BASE_URL + '/5', {
    method: 'DELETE',
    headers: {
      'user': 2
    }
  })
  .then(res => {
    expect(res.status).toBe(404);
      DB.edit_data(data => {
       expect(data.classes[5]).toBe(undefined);
     });
  });
});

test('failing delete class no permission', () => {
  expect.assertions(2);
  return fetch(BASE_URL + '/0', {
    method: 'DELETE',
    headers: {
      'user': 2
    }
  })
  .then(res => {
    expect(res.status).toBe(403);
      DB.edit_data(data => {
       expect(data.classes[0].creator).toBe(0);
     });
  });
});

test('successful delete class', () => {
  expect.assertions(2);
  return fetch(BASE_URL + '/0', {
    method: 'DELETE',
    headers: {
      'user': 0
    }
  })
  .then(res => {
    expect(res.status).toBe(200);
     DB.edit_data(data => {
      expect(data.classes[0]).toBe(undefined);
    });
  });
});
