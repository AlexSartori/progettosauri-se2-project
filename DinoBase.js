const fs = require('fs');
const DB_PATH = "db.json";

function read_data(fun) {
    data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    fun(data);
}

function edit_data(fun) {
    let data;
    read_data((d) => data = d);

    fun(data);

    let db_file = fs.openSync(DB_PATH, 'w');
    fs.writeSync(db_file, JSON.stringify(data));
    fs.closeSync(db_file);
}

module.exports = { read_data, edit_data, DB_PATH }
