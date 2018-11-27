const exams = require('../../endpoints/exams')
const fetch = require('node-fetch');
const fs = require('fs');
const DB = require('../../DinoBase');
const server = require('../../index').server;
const PORT = process.env.PORT || require('../../index').PORT;
const BASE_URL = `http://localhost:${PORT}/`;


beforeAll(() => {
  process.env.TESTING = true;
  fs.writeFileSync(DB.DB_TEST_PATH, JSON.stringify({
      key: 0,
      value: {
          name: 'Exam #1',
          taskGroup: 121,
          mode: 'crowd sourcing',
          class: 18,
          TA: [12],
          deadline: '2019-01-15 23:59',
          duration: 120,
          start: '2019-01-15 00:00'
      }
  }));
});

test("Successfully create Exam", () => {
    test_exam = {
        name: 'Test Exam',
        taskGroup: 0,
        mode: 'exam',
        class: 5,
        TA: [2, 12, 6],
        deadline: '2018-12-21 20:00',
        duration: 120,
        start: '2018-12-15 08:00'
    };

    expect.assertions(2);
    return fetch(BASE_URL + "exams", {
        method: 'post',
        body: JSON.stringify(test_exam),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
        expect(res.status).toEqual(201);
        return res.text();
    }).then(() => {
        DB.edit_data((data) => {
            test_exam.id = 1;
            expect(data['exams'][0].value).toEqual(test_exam);
        })
    });
});

test("Fail create Exam with [400 Bad Parameters]", () => {
    test_exam = {
        wrong: 'parameter'
    };

    expect.assertions(1);
    return fetch(BASE_URL + "exams", {
        method: 'post',
        body: JSON.stringify(test_exam),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
        expect(res.status).toEqual(400);
        return res.text();
    });
});

test("Get existing Exam", () => {
    test_exam = {
        name: 'Exam #1',
        taskGroup: 121,
        mode: 'crowd sourcing',
        class: 18,
        TA: [12],
        deadline: '2019-01-15 23:59',
        duration: 120,
        start: '2019-01-15 00:00'
    };

    fs.writeFileSync(DB.DB_TEST_PATH, JSON.stringify({
            key: 0,
            value: test_exam
    }));

    expect.assertions(1);
    return fetch(BASE_URL + "exams")
    .then(res => {
        expect(res.status).toEqual(200);
        return res.text();
    }).then(res => {
        test_exam.id = 0;
        expect(JSON.parse(res)).toEqual(test_exam);
    });
});


afterAll(() => {
  fs.writeFileSync(DB.DB_TEST_PATH, '{}');
  server.close();
});
