const express = require('express');
const apps = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const route = require('./Route/route');
const xssFilter = require('x-xss-protection')
require('dotenv/config');

apps.use(
    bodyParser.urlencoded({
        extended:true,
    })
);
apps.use(xssFilter())
apps.use(bodyParser.json());
route(apps);
//apps.get('/', (req, res) => res.send('hello world'))

apps.listen(port)

console.log(`http://localhost/${port}`);




