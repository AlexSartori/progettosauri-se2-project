const DB = require('../../DinoBase');
const fetch = require('node-fetch');
const fs = require('fs');
const clean_db = require('../test_utils').clean_db;
const server = require('../../index').server;
const PORT = require('../../index').PORT;
const BASE_URL = `http://localhost:${PORT}/`;

beforeAll(() => {
    clean_db();
});


test("Create valid Task Group", () => {
    clean_db();

    test_tg = {
        name: "TG #1",
        tasks: [1, 2, 3, 4]
    };

    expect.assertions(3);
    return fetch(BASE_URL + "task_groups", {
        method: 'post',
        body: JSON.stringify(test_tg),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
        expect(res.status).toEqual(201);
        return res.text();
    }).then((res) => {
        expect(res).toEqual('0');

        DB.edit_data((data) => {
            test_tg.id = 0;
            expect(data.task_groups[0]).toEqual(test_tg);
        });
    });
});

test("Create invalid Task Group", () => {
    clean_db();

    test_tg = {
        name: -15,
        tasks: "Ciao"
    };

    expect.assertions(1);
    return fetch(BASE_URL + "task_groups", {
        method: 'post',
        body: JSON.stringify(test_tg),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
        expect(res.status).toEqual(400);
        return res.text();
    });
});

afterAll(() => {
    clean_db();
    server.close();
});
