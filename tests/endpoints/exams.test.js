const exams = require('../../endpoints/exams')
const fetch = require('node-fetch');
const fs = require('fs');
const DB = require('../../DinoBase');
const clean_db = require('../test_utils').clean_db;
const server = require('../../index').server;
const PORT = process.env.PORT || require('../../index').PORT;
const BASE_URL = `http://localhost:${PORT}/`;


beforeAll(() => {
    clean_db();
});

test("Create valid Exam", () => {
    clean_db();

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
            test_exam.id = 0;
            expect(data.exams[0]).toEqual(test_exam);
        })
    });
});

test("Create invalid exam", () => {
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

test("Modify valid Exam", () => {
    let test_exam = {
        name: 'Test Exam',
        taskGroup: 0,
        mode: 'exam',
        class: 5,
        TA: [2, 12, 6],
        deadline: '2018-12-21 20:00',
        duration: 120,
        start: '2018-12-15 08:00'
    };

    fs.writeFileSync(DB.DB_PATH, JSON.stringify({
        exams: {
            0: test_exam
        }
    }));

    // Modify exam
    test_exam.name = "New Name";
    test_exam.class = 18;
    test_exam.TA.push(113);
    test_exam.id = 0;

    expect.assertions(2);
    return fetch(BASE_URL + "exams/0", {
        method: 'put',
        body: JSON.stringify(test_exam),
        headers: { 'Content-Type': 'application/json', 'user': 12 }
    }).then(res => {
        expect(res.status).toEqual(200);
        return res.text();
    }).then(() => {
        DB.edit_data((data) => {
            expect(data.exams[0]).toEqual(test_exam);
        })
    });
});

test("Modify invalid Exam", () => {
    let EXAM_ID = 0;
    let test_exam = {
        name: 'Test Exam',
        taskGroup: 0,
        mode: 'exam',
        class: 5,
        TA: [2, 12, 6],
        deadline: '2018-12-21 20:00',
        duration: 120,
        start: '2018-12-15 08:00'
    };

    fs.writeFileSync(DB.DB_PATH, JSON.stringify({
        exams: {
            0: test_exam
        }
    }));

    // Modify exam
    test_exam.name = "New Name";
    test_exam.class = "Should be int";
    test_exam.deadline = "Totally not a date string";

    expect.assertions(1);
    return fetch(BASE_URL + "exams/" + EXAM_ID, {
        method: 'put',
        body: JSON.stringify(test_exam),
        headers: { 'Content-Type': 'application/json', 'user': 2}
    }).then(res => {
        expect(res.status).toEqual(400);
        return res.text();
    });
});

test("Modify non-existing Exam", () => {
    let test_exam = {
        id: 12345,
        name: 'Non-Existing Exam',
        taskGroup: 0,
        mode: 'exam',
        class: 5,
        TA: [2, 12, 6],
        deadline: '2018-12-21 20:00',
        duration: 120,
        start: '2018-12-15 08:00'
    };

    expect.assertions(1);
    return fetch(BASE_URL + "exams", {
        method: 'put',
        body: JSON.stringify(test_exam),
        headers: { 'Content-Type': 'application/json', 'user': 6 }
    }).then(res => {
        expect(res.status).toEqual(404);
        return res.text();
    });
});

test("Modify unauthorized Exam", () => {
    let test_exam = {
        name: 'Test Exam',
        taskGroup: 0,
        mode: 'exam',
        class: 5,
        TA: [2, 12, 6],
        deadline: '2018-12-21 20:00',
        duration: 120,
        start: '2018-12-15 08:00'
    };

    fs.writeFileSync(DB.DB_PATH, JSON.stringify({
        exams: { 0: test_exam }
    }));

    // Modify exam
    test_exam.name = "New Name";

    expect.assertions(1);
    return fetch(BASE_URL + "exams/0", {
        method: 'put',
        body: JSON.stringify(test_exam),
        headers: { 'Content-Type': 'application/json', 'user': 12345 }
    }).then(res => {
        expect(res.status).toEqual(403);
        return res.text();
    });
});

test("Get existing Exam", () => {
    let test_exam = {
        id: 0,
        name: 'Exam #1',
        taskGroup: 121,
        mode: 'crowd sourcing',
        class: 18,
        TA: [12],
        deadline: '2019-01-15 23:59',
        duration: 120,
        start: '2019-01-15 00:00'
    };

    fs.writeFileSync(DB.DB_PATH, JSON.stringify({ exams: { 0: test_exam } }));

    expect.assertions(2);
    return fetch(BASE_URL + "exams/0")
    .then(res => {
        expect(res.status).toEqual(200);
        return res.text();
    }).then(res => {
        expect(JSON.parse(res)).toEqual(test_exam);
    }).then(() => {
        clean_db();
    });
});

test("Get non-existing Exam", () => {
    expect.assertions(1);

    return fetch(BASE_URL + "exams/12345")
    .then(res => {
        expect(res.status).toEqual(404);
        return res.text();
    });
});

test("Delete existing Exam", () => {
    fs.writeFileSync(DB.DB_PATH, JSON.stringify({
        exams: {
            0: {
                id: 0,
                name: 'Exam #1',
                taskGroup: 121,
                mode: 'crowd sourcing',
                class: 18,
                TA: [12],
                deadline: '2019-01-15 23:59',
                duration: 120,
                start: '2019-01-15 00:00'
            }
        }
    }));

    expect.assertions(1);
    return fetch(BASE_URL + "exams/0", {
        method: 'delete',
        headers: { 'user': 12 }
    }).then(res => {
        expect(res.status).toEqual(200);
        return res.text();
    }).then(() =>
        clean_db()
    );
});

test("Delete unauthorized Exam", () => {
    fs.writeFileSync(DB.DB_PATH, JSON.stringify({
        exams: {
            0: {
                id: 0,
                name: 'Exam #1',
                taskGroup: 121,
                mode: 'crowd sourcing',
                class: 18,
                TA: [12],
                deadline: '2019-01-15 23:59',
                duration: 120,
                start: '2019-01-15 00:00'
            }
        }
    }));

    expect.assertions(1);
    return fetch(BASE_URL + "exams/0", {
        method: 'delete',
        headers: { user: 12345 }
    }).then(res => {
        expect(res.status).toEqual(403);
        return res.text();
    }).then(() =>
        clean_db()
    );
});

test("Delete non-existing Exam", () => {
    expect.assertions(1);

    return fetch(BASE_URL + "exams/12345", {method: 'delete'})
    .then(res => {
        expect(res.status).toEqual(404);
        return res.text();
    });
});

test("Get exam's tasks and start the exam", () => {
  let db = {
      exams: {
          "0": {
              id: 0,
              name: 'Exam #1',
              taskGroup: 121,
              mode: 'crowd sourcing',
              class: 18,
              TA: [12],
              deadline: '2222-01-15 23:59',
              duration: 120,
              start: '2018-01-15 00:00'
          }
      },
      classes: {
        18: {
          id: 18,
          users: [1, 2],
          name: 'Class #19',
          creator: 0
        }
      },
      users: {
        0: {},
        1: {},
        2: {},
        12: {}
      },
      enrolls: {
        '0,1': {
          tasks: [1, 2, 3]
        }
      },
      tasks: {
        1: {
          id: 1,
          text: 'Task #1',
          creator: 0
        },
        2: {
          id: 2,
          text: 'Task #2',
          creator: 0
        },
        3: {
          id: 3,
          text: 'Taks #3',
          creator: 0,
          answers: [
            {
              id: 1,
              text: 'True',
              correct: false
            },
            {
              id: 2,
              text: 'False',
              correct: true
            }
          ]
        },
        4: {
          id: 4,
          text: 'Task #4',
          creator: 0
        }
      }
  };

  fs.writeFileSync(DB.DB_PATH, JSON.stringify(db));

  let expected_response = [
    {
      id: 1,
      text: 'Task #1'
    },
    {
      id: 2,
      text: 'Task #2'
    },
    {
      id: 3,
      text: 'Taks #3',
      answers: [
        {
          id: 1,
          text: 'True'
        },
        {
          id: 2,
          text: 'False'
        }
      ]
    }
  ];

  expect.assertions(3);
  return fetch(BASE_URL + 'exams/0/tasks', {
    method: 'GET',
    headers: {
      'user': 1
    }
  })
  .then(res => {
    expect(res.status).toEqual(200);
    return res.text();
  })
  .then(body => {
    expect(JSON.parse(body)).toEqual(expected_response);
    DB.read_data(data => {
      let registered_time = new Date(data.enrolls['0,1'].starting_date);
      let diff = (new Date()) - registered_time;
      let accetable = diff < 1000;  // Less then 1 second
      expect(accetable).toBe(true);
    });
  });
});

test("Get tasks of non-existing exam", () => {
  clean_db();

  expect.assertions(1);
  return fetch(BASE_URL + 'exams/0/tasks', {
    method: 'GET',
    headers: {
      'user': 1
    }
  })
  .then(res => {
    expect(res.status).toEqual(404);
  });
});

test("Get exam's tasks invalid request", () => {
  clean_db();

  expect.assertions(1);
  return fetch(BASE_URL + 'exams/0/tasks', {
    method: 'GET'
  })
  .then(res => {
    expect(res.status).toEqual(400);
  });
});

test("Get exam's tasks unauthorized", () => {
  let db = {
      exams: {
          "0": {
              id: 0,
              name: 'Exam #1',
              taskGroup: 121,
              mode: 'crowd sourcing',
              class: 18,
              TA: [12],
              deadline: '2222-01-15 23:59',
              duration: 120,
              start: '2018-01-15 00:00'
          }
      },
      classes: {
        18: {
          id: 18,
          users: [1, 2],
          name: 'Class #19',
          creator: 0
        }
      }
  };

  fs.writeFileSync(DB.DB_PATH, JSON.stringify(db));

  expect.assertions(1);
  return fetch(BASE_URL + 'exams/0/tasks', {
    method: 'GET',
    headers: {
      'user': 5
    }
  })
  .then(res => {
    expect(res.status).toEqual(403);
  });
});

test("Get tasks of not started exam", () => {
  let current_date = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(current_date.getDate() + 1);
  tomorrow = tomorrow.toString();
  let db = {
      exams: {
          "0": {
              id: 0,
              name: 'Exam #1',
              taskGroup: 121,
              mode: 'crowd sourcing',
              class: 18,
              TA: [12],
              deadline: '2222-01-15 23:59',
              duration: 120,
              start: tomorrow
          }
      },
      classes: {
        18: {
          id: 18,
          users: [1, 2],
          name: 'Class #19',
          creator: 0
        }
      }
  };

  fs.writeFileSync(DB.DB_PATH, JSON.stringify(db));

  expect.assertions(1);
  return fetch(BASE_URL + 'exams/0/tasks', {
    method: 'GET',
    headers: {
      'user': 1
    }
  })
  .then(res => {
    expect(res.status).toEqual(403);
  });
});

afterAll(() => {
    clean_db();
    server.close();
});
