const conc = require('../endpoints/users').create_user

test('create_user invalid parameters', () => {
    let fetch = require('node-fetch');
    fetch('http://localhost:3000/users', {
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
    let fetch = require('node-fetch');
    fetch('http://localhost:3000/users', {
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