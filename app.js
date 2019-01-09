var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var redis = require('redis');

var app = express();

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
    res.send('Welcome to Redis Tasks!!')
})
app.listen(3000);
console.log('Server started at 3000');

module.exports = app;
