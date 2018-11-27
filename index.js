const express = require('express');
const PORT = process.env.PORT || 3000;
let app = express();

const users = require('./endpoints/users');
users.register_endpoints(app);

server = app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

module.exports = {app, PORT, server};
