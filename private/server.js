var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var bp = require('body-parser');

app.use(bp());
app.use('/', express.static(path.join(__dirname, '../')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../index.html'));
    console.log("received get / request");
});

app.post('/sub', function (req, res) {
    console.log(JSON.stringify(req.body.emailinput));
    res.redirect('/');
});

server.listen(7777);
console.log("server listening . . .");
