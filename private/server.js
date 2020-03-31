var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var bp = require('body-parser');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: 'string'
});

app.use(bp());
app.use('/', express.static(path.join(__dirname, '../')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../index.html'));
    console.log("received get / request");
});

app.post('/sub', async function (req, res) {
    console.log(JSON.stringify(req.body.emailinput));

    mongoose.connect('mongodb://cosmingugoasa:GC15973k@mongodb-cosmingugoasa.alwaysdata.net/cosmingugoasa_coronatracker', {useNewUrlParser: true, useUnifiedTopology: true });
    var db = mongoose.connection;
    db.on('error', function (error) {
        console.log(error);
    });
    db.once('open', function () {
        console.log("Connected to Database :");
    });

    var users = mongoose.model('Users', userSchema);
    var new_user = new users({email: req.body.emailinput});
    await new_user.save(function (err) {
        if (err) console.log(err);
        else console.log("Added : " + req.body.emailinput);
    });

    res.redirect('/');
});

server.listen(7777);
console.log("server listening . . .");