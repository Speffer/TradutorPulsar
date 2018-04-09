const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const port = 3000;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

consign()
    .include("routes")
    .into(app);

app.listen(port); 