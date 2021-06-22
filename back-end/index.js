const express = require('express');
const app = express();
const cors = require('cors')
const routes = require('./routes');

const corsOptions = {
    origin: '*',
}

app
    .use(cors(corsOptions))
    .use(routes)
    .use(express.static('public'))
    .listen(3000, function () {
        console.log('Listening on port 3000!');
    });
