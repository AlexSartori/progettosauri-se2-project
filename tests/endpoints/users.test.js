const fetch = require('node-fetch');
const server = require('../../index').server;
const PORT = require('../../index').PORT;
const BASE_URL = `http://localhost:${PORT}/`;
const USER_URL = 'users/'
const create_users = require('../test_utils').create_users
const clean_db = require('../test_utils').clean_db
const DB = require('../../DinoBase');

beforeAll(() => {
  clean_db()
});

afterAll(() => {
  clean_db();
  server.close();
});

// create_user tests:
// INVALID TESTS
// - not enough parameters (should be done for every param)
test('create_user, invalid, not enough parameters', () => {
  clean_db();
  var user = {'name': 'test_user',
              'password': 'test'}
  expect.assertions(2);
    return fetch(BASE_URL + USER_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    }).then(response => {
        expect(response.status).toEqual(400);
        return response.text()
    }).then(text => {
        expect(text).toEqual("Bad parameter")
        clean_db()
    })
});

// INVALID TESTS
// - wrong type parameters (should be done for every param)
test('create_user, invalid, not enough parameters', () => {
  clean_db();
  var user = {'name': 'test_user',
              'mail': 'mail@mail',
              'password': 5 }
  expect.assertions(2);
    return fetch(BASE_URL + USER_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    }).then(response => {
        expect(response.status).toEqual(400);
        return response.text()
    }).then(text => {
        expect(text).toEqual("Bad parameter")
        clean_db()
    })
});


// VALID TEST
test('create_user, valid parameters', () => {
  clean_db();
  var user = {'name': 'test_user',
              'mail': 'mail@test.com',
              'password': 'test'}
  expect.assertions(2);
    return fetch(BASE_URL + USER_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    }).then(response => {
        expect(response.status).toEqual(201);
        return response.text()
    }).then( new_id => {
        user.id=new_id
        return fetch(BASE_URL + USER_URL + new_id)
    }).then(res => {
        expect(res.status).toEqual(200);
        return res.json()
    }).then(text => {
        expect(text).toEqual(user)
        clean_db()
    })
})

//get_user_details test:
//VALID TEST
test('Get user test, valid ID, users exist', () => {
  //insert the user in db to make sure i get a valid response
  create_users()
  expect.assertions(2);
  ID = 0
  return fetch(BASE_URL + USER_URL+ ID
  ).then(res => {
        expect(res.status).toEqual(200);
        return res.json()
    }).then(text => {
       DB.edit_data((data) => {
         expect(text).toEqual(data.users[0])
       })
      clean_db()
    })
});

// invalid TESTS:
// - user_id is not an integer
test('Get user test, invalid ID, not an integer', () => {
    expect.assertions(2);
    ID = 'string'
    return fetch(BASE_URL + USER_URL+ ID
    ).then(res => {
        expect(res.status).toEqual(400);
        return res.text();
    }).then(text =>
        expect(text).toEqual('Bad parameter, user_id should be a positive integer'));
 });

// - user_id is not a positive integer
test('Get user test, invalid ID, negative integer ', () => {
    expect.assertions(2);
    ID = '-1'
    return fetch(BASE_URL + USER_URL+ ID,
    ).then(res => {
        expect(res.status).toEqual(400);
        return res.text();
    }).then(text =>
        expect(text).toEqual('Bad parameter, user_id should be a positive integer'));
});

// - user_id is not in db
test('Get user test, invalid ID, not found', () => {
    clean_db()
    ID = 1
    expect.assertions(2);
    return fetch(BASE_URL + USER_URL+ ID
    ).then(res => {
        expect(res.status).toEqual(404);
        return res.text();
    }).then(text =>
        expect(text).toEqual('User does not exist'));
});

// Delete_user tests:
// VALID TEST:
// - user_id exists and it's equal to user in headers
test('Delete user, valid test', () => {
    create_users();
    expect.assertions(2);
    ID = 0
    return fetch(BASE_URL + USER_URL+ ID, {
        method: 'DELETE',
        headers:{'Content-Type': 'application/json',
                 'user' : ID}
    }).then(res => {
        expect(res.status).toEqual(200);
        return res.text()
    }).then(text => {
       expect(text).toEqual("Success, account has been deleted")
       clean_db()})
});

//invalid TESTS:
// - user_id != header user (both users have to exist)
test('Delete user test, user_id is different from user in header', () => {
    clean_db();
    create_users();
    expect.assertions(2);
    ID = 0
    return fetch(BASE_URL + USER_URL+ ID, {
        method: 'DELETE',
        headers:{'Content-Type': 'application/json',
                 'user' : 1}
    }).then(res => {
        expect(res.status).toEqual(403);
        return res.text();
    }).then(text => {
        expect(text).toEqual("Permission denied, you are trying to delete an other user's account")
        clean_db()})
 });

// - user_id is not an integer (user_id should be equal to user in headers)
test('Delete user test, invalid user_id, not an integer', () => {
    expect.assertions(2);
    ID= 'string'
    return fetch(BASE_URL + USER_URL+ ID, {
        method: 'DELETE',
        headers:{ 'Content-Type': 'application/json',
                  'user' : ID}
    }).then(res => {
        expect(res.status).toEqual(400);
        return res.text();
    }).then(text =>
        expect(text).toEqual('Bad parameter, user_id should be a positive integer'));
 });


// - user_id is not a positive integer (user_id should be equal to user in headers)
test('Delete user test, invalid user_id, negative integer ', () => {
    expect.assertions(2);
    ID= -1
    return fetch(BASE_URL + USER_URL+ ID, {
        method: 'DELETE',
        headers:{'Content-Type': 'application/json',
                 'user' : ID}
    }).then(res => {
        expect(res.status).toEqual(400);
        return res.text();
    }).then(text =>
        expect(text).toEqual('Bad parameter, user_id should be a positive integer'));
});

// - user_id is not in db (user_id should be equal to user in headers)
test('Delete user test, user_ID not in db', () => {
    clean_db();
    expect.assertions(2);
    ID = 0
    return fetch(BASE_URL + USER_URL+ ID,  {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',
                  'user' : ID}
    }).then(res => {
        expect(res.status).toEqual(404);
        return res.text();
    }).then(text =>
        expect(text).toEqual('User does not exist'));
});

// edit_user_details tests:
// VALID TESTS
// - string type object in body (no other requirements), valid user_id in path, user exists, permission is valid
test("Edit user details, valid test", () => {
    ID = 0
    var user = create_users()
    user.users[0].name = 'newname'
    user.users[0].surname='newsurname'
    expect.assertions(2);
    return fetch(BASE_URL+USER_URL+ID, {
            method: 'PUT',
            headers: {'Content-Type':'application/json',
                      'user' : ID},
            body: JSON.stringify(user.users[0])
    }).then( res => {
        expect(res.status).toEqual(200);
        return res.json();
    }).then( text => {
      DB.edit_data((data) =>  {
        expect(text).toEqual(data.users[ID])
      })
      clean_db()
    })
})

//INVALID tests
// - user_id diffrent from user in header
// - invalid user_id (<0)
// - invalid user_Id (not a number)
// - invalid body (not all parameters)
// - invalid body (not all parameters have correct type)
