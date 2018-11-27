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

//get_user_details test:
//VALID TEST
test('Get user test, valid ID, users exist', () => {
    var user= {"users":[{
        "key":0,
             "value":{"email":"prova@dinomail.com",
             "password":"dinopwd",
             "name":"dinoname",
             "surname":"dinosurname"}}]
    }    

    fs.writeFileSync(DB.DB_TEST_PATH, JSON.stringify(user))
    expect.assertions(2);
    ID = 0
    return fetch(BASE_URL + 'users/'+ ID, 
        {method: 'GET', 
        headers:{'Content-Type': 'application/json'}
    }).then(res => {
        expect(res.status).toEqual(200);
        return res.json()
    }).then(text => {
        expect(text).toEqual(data['users'][0])
        fs.writeFileSync(DB.DB_TEST_PATH, {})
    })
});

// UNVALID TESTS:
// - ID is not an integer
test('Get user test, unvalid ID, not an integer', () => {
    expect.assertions(2);
    ID= 'string'
    return fetch(BASE_URL + 'users/'+ ID, 
        {method: 'GET',  
         headers:{'Content-Type': 'application/json'}
    }).then(res => {
        expect(res.status).toEqual(400);
        return res.text();
    }).then(text => 
        expect(text).toEqual('Bad parameter, user_id should be a positive integer'));
 });
    
// - ID is not a positive integer  
test('Get user test, unvalid ID, negative integer ', () => {
    expect.assertions(2);
    ID= '-1' 
    return fetch(BASE_URL + 'users/'+ ID, 
        {method: 'GET', 
        headers:{'Content-Type': 'application/json'}
    }).then(res => {
        expect(res.status).toEqual(400);
        return res.text();
    }).then(text => 
        expect(text).toEqual('Bad parameter, user_id should be a positive integer'));
});
/*    
// - ID is not in db
test('Get user test, unvalid ID, not found', () => {
   DB.edit_data((data) => {
        ID = (Object.keys(data['users']).sort().length+1).toString()
    });
    
    ID = 40
    expect.assertions(2);
    return fetch(BASE_URL + 'users/'+ ID
    ).then(res => { 
        expect(res.status).toEqual(404);
        return res.text();
    }).then(text => 
        expect(text).toEqual('User does not exist'));
});*/

