const fs = require('fs');
const DB_PATH = "db.json";


function edit_data(fun) {
    data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    fun(data);
    fs.writeFileSync(DB_PATH, JSON.stringify(data));
}


module.exports = { edit_data, DB_PATH }
