var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var bp = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
require('dotenv').config();

app.use(bp());
app.use('/', express.static(path.join(__dirname, '../')));

//database model and schema
var userSchema = mongoose.Schema({
    email: 'string'
});
var users = mongoose.model('Users', userSchema);

//database connection
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', function (error) {
    console.log(error);
});
db.once('open', function () {
    console.log("Connected to Database. \n");
});

//request lates data from api
request('https://coronavirus-tracker-api.herokuapp.com/v2/latest', {json: true}, function (err, res, body) {
    if(err) {return console.log(err)}
    console.log(body);
    //use body.confirmed ecc..
});

//send email to all subs
users.find({}, {_id: 0, __v: 0}, function (err, data) {
    console.log("Subscribed users :");
    data.forEach(function (element) {
        console.log(element.email);
        //TODO SEND MAIL TO element.mail
    })
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../index.html'));
    console.log("received get / request");
});

app.post('/sub', async function (req, res) {
    var new_user = new users({email: req.body.emailinput});
    await new_user.save(function (err) {
        if (err) console.log(err);
        else console.log("Added : " + req.body.emailinput);
    });

    res.redirect('/');
});

server.listen(7777);
console.log("\nServer listening . . .");