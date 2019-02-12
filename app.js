var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var redis = require('redis');

var app = express();

// Create client
var redisClient = redis.createClient();

redisClient.on('connect', () => {
    console.log('Redis Server connected...');
})

// Set the view folder and the template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware settings
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname,'public')));

// Basic route
app.get('/', (req, res) => {
    var title = 'Task List';
    redisClient.lrange('tasks', 0, -1, (err, reply) => {
        redisClient.hgetall('call', (err, call) => {
            res.render('index', {
                title: title,
                tasks: reply,
                call: call
            });
        });
    });
});
// Add Task Route
app.post('/task/add', (req, res) => {
    var task = req.body.task;

    redisClient.rpush('tasks', task, (err, reply) => {
        if (err){
            console.log(err);
        }
        console.log('Task Added...')
        res.redirect('/');
    });
});
// Delete Task Route
app.post('/task/delete', (req, res) => {
    var tasksToDel = req.body.tasks;

    redisClient.lrange('tasks', 0, -1, (err, tasks) => {
        for(var i = 0; i < tasks.length; i++){
            if (tasksToDel.indexOf(tasks[i]) > -1) {
                redisClient.lrem('tasks', 0, tasks[i], () => {
                    if(err){
                        console.log(err);
                    }
                });
            }
        }
        res.redirect('/');
    });
});
// Add call route
app.post('/call/add', (req, res) => {
    var newCall = {};

    newCall.name = req.body.name;
    newCall.company = req.body.company;
    newCall.phone = req.body.phone;
    newCall.time = req.body.time;

    redisClient.hmset('call', [
        'name', newCall.name,
        'company', newCall.company,
        'phone', newCall.phone,
        'time', newCall.time],
        function(err, reply) {
            if(err){
                console.log(err);
            }
            console.log(reply);
            res.redirect('/');
        }
    );
});
// Listen to port 3000
app.listen(3000);
console.log('Server started at 3000');

module.exports = app;
