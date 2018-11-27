const DB = require('./DinoBase.js');
const fs = require('fs');


// Clear test DB before and after
beforeAll(() => {
    process.env.TESTING = true;
    fs.writeFileSync(DB.DB_TEST_PATH, "{}");
});

afterAll(() => {
    fs.writeFileSync(DB.DB_TEST_PATH, "{}");
});


test("Database Write", () => {
    // Write something
    DB.edit_data((data) => {
        data['prova'] = {
            'what': 'An object',
            'why': ['for', 'testing']
        }
    });

    // Check what was written
    data = JSON.parse(fs.readFileSync(DB.DB_TEST_PATH, 'utf8'));
    expect(data).toEqual({
        'prova': {
            'what': 'An object',
            'why': ['for', 'testing']
        }
    });
});


test("Database Read", () => {
    fs.writeFileSync(DB.DB_TEST_PATH, '{"prova":{"what":"An object","why":["for","testing"]}}');

    read = {};
    DB.edit_data((data) => {
        read = data;
    });

    expect(read).toEqual({
        'prova': {
            'what': 'An object',
            'why': ['for', 'testing']
        }
    });
});
