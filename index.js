const express = require('express');
const PORT = process.env.PORT || 3000;
let app = express();

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
