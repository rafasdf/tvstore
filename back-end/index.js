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
    .use('/images', express.static('public/images'))
    .use(express.urlencoded({ extended: true }))
    .listen(3000, function () {
        console.log('Listening on port 3000!');
    });
