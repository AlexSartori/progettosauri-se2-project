const conc = require('../endpoints/users').create_user;
const fs = require('fs');
const DB = require('../DinoBase');
const fetch = require('node-fetch');
const server = require('../index').server;
const PORT = require('../index').PORT;
const BASE_URL = `http://localhost:${PORT}/`;

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

// Delete_user tests:
// VALID TEST: (esiste ed è uguale)
test('Delete user, valid test', () => {
    var user= {"users":[{
        "key":1,
             "value":{"email":"prova@dinomail.com",
             "password":"dinopwd",
             "name":"dinoname",
             "surname":"dinosurname"}}]
  }    
    fs.writeFileSync(DB.DB_TEST_PATH, JSON.stringify(user))
    expect.assertions(2);
    ID = 1
    return fetch(BASE_URL + 'users/'+ ID, { 
        method: 'DELETE',
        headers:{'Content-Type': 'application/json',
                 'user' : ID}
    }).then(res => {
        expect(res.status).toEqual(200);
        return res.text()
    }).then(text => {
        fs.writeFileSync(DB.DB_TEST_PATH, {})
        expect(text).toEqual("Success, account has been deleted")})
        
});

//UNVALID TESTS:
// - user_id != req

test('Delete user test, user_id is different from user in header', () => {
    expect.assertions(2);
    ID = 0
    return fetch(BASE_URL + 'users/'+ ID, {
        method: 'DELETE',
        headers:{'Content-Type': 'application/json',
                 'user' : 1}
    }).then(res => {
        expect(res.status).toEqual(403);
        return res.text();
    }).then(text => 
        expect(text).toEqual("Permission denied, you are trying to delete an other user's account"));
 });

// - ID is not an integer
test('Delete user test, unvalid user_id, not an integer', () => {
    expect.assertions(2);
    ID= 'string'
    return fetch(BASE_URL + 'users/'+ ID, {
        method: 'DELETE',
        headers:{ 'Content-Type': 'application/json',
                  'user' : 0}
    }).then(res => {
        expect(res.status).toEqual(400);
        return res.text();
    }).then(text => 
        expect(text).toEqual('Bad parameter, user_id should be a positive integer'));
 });
       

// - ID is not a positive integer  
test('Delete user test, unvalid user_id, negative integer ', () => {
    expect.assertions(2);
    ID= '-1' 
    return fetch(BASE_URL + 'users/'+ ID, {
        method: 'DELETE',
        headers:{'Content-Type': 'application/json',
                 'user' : 0}
    }).then(res => {
        expect(res.status).toEqual(400);
        return res.text();
    }).then(text => 
        expect(text).toEqual('Bad parameter, user_id should be a positive integer'));
});

/*
// - user_id is not in db
test('Delete user test, user_ID not in db', () => {
    expect.assertions(2);
    DB.edit_data((data) => {
        ID = (Object.keys(data['users']).sort().length+1).toString()
    });
    return fetch(BASE_URL + 'users/'+ ID,  {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',
                  'user' : parseInt(ID)}
    }).then(res => { 
        expect(res.status).toEqual(404);
        return res.text();
    }).then(text => 
        expect(text).toEqual('User does not exist'));
});
*/