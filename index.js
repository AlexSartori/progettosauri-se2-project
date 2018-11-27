const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const endpoints_dir = 'endpoints'; // The directory of the endpoints definitions
const PORT = process.env.PORT || 3000;
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Call register_endpoints for each file
fs.readdirSync(endpoints_dir).forEach((file) => {
  let register = require(`./${endpoints_dir}/${file}`).register_endpoints;
  register(app);
});

server = app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

register_endpoints = require('./endpoints/exams').register_endpoints;
register_endpoints(app);

module.exports = {app, PORT, server};
