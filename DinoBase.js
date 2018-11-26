const fs = require('fs');
const DB_PATH = "db.json";
const DB_TEST_PATH = "db.test.json";


function edit_data(fun, testing) {
    path = testing ? DB_TEST_PATH : DB_PATH;

    data = JSON.parse(fs.readFileSync(path, 'utf8'));
    fun(data);
    fs.writeFileSync(path, JSON.stringify(data));
}


module.exports = { edit_data, DB_PATH, DB_TEST_PATH }
