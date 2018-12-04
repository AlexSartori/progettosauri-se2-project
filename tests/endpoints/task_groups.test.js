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

test("Get specfic existing Task Group", () => {
    clean_db();

    test_tg = {
        id: 0,
        name: "TG #1",
        tasks: [1, 2, 3, 4]
    };

    fs.writeFileSync(DB.DB_PATH, JSON.stringify({ task_groups: { 0: test_tg } }));

    expect.assertions(2);
    return fetch(BASE_URL + "task_groups/0")
    .then(res => {
        expect(res.status).toEqual(200);
        return res.text();
    }).then(res => {
        expect(JSON.parse(res)).toEqual(test_tg);
    });
});

test("Get specfic non-existing Task Group", () => {
    clean_db();

    expect.assertions(1);
    return fetch(BASE_URL + "task_groups/12345")
    .then(res => {
        expect(res.status).toEqual(404);
        return res.text();
    });
});

test("Get all Task Groups", () => {
    clean_db();

    test_tg_1 = {
        id: 0,
        name: "TG #1",
        tasks: [1, 2, 3, 4]
    },
    test_tg_2 = {
        id: 2,
        name: "TG #2",
        tasks: [712, 121, 456]
    };

    fs.writeFileSync(DB.DB_PATH, JSON.stringify({
        task_groups: {
            0: test_tg_1,
            1: test_tg_2
        }
    }));

    expect.assertions(2);
    return fetch(BASE_URL + "task_groups")
    .then(res => {
        expect(res.status).toEqual(200);
        return res.text();
    }).then(res => {
        expect(JSON.parse(res)).toEqual([test_tg_1, test_tg_2]);
    });
});

test("Delete existing Task Group", () => {
    clean_db();

    test_tg = {
        id: 0,
        name: "TG #1",
        tasks: [1, 2, 3, 4]
    };

    fs.writeFileSync(DB.DB_PATH, JSON.stringify({ task_groups: { 0: test_tg } }));

    expect.assertions(1);
    return fetch(BASE_URL + "task_groups/0", {method: 'delete'})
    .then(res => {
        expect(res.status).toEqual(200);
        return res.text();
    });
});

test("Delete non-existing Task Group", () => {
    clean_db();

    expect.assertions(1);
    return fetch(BASE_URL + "task_groups/12345", {method: 'delete'})
    .then(res => {
        expect(res.status).toEqual(404);
        return res.text();
    });
});

afterAll(() => {
    clean_db();
    server.close();
});
