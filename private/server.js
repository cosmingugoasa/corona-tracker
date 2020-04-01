require('dotenv').config();

var express = require('express');
const nodemailer = require('nodemailer');
let CronJob = require('cron').CronJob;

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

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
//TODO: Use emails stored on database
//TODO: Fetch latest data from API
let options = {
    from: '"COVID-19 Tracker"coronatracker.noreply@gmail.com',

    to: 'savastrecosmingabriele@gmail.com',
    subject: 'Dati aggiornati per il '+ new Date().toLocaleDateString(),
    text: 'Numeri aggiornati',
    html: '<h1>Numeri aggiornati</h1><p>Funziona!</p>'
};




let job = new CronJob('0 0 19 * * *', function() {
    console.log('You will see this message every minute');
    transporter.sendMail(options, function (error, data) {
       if(error){
           console.log("Errore nell'invio delle E-mail: ", error);
       } else {
           console.log("E-mail inviata con successo");
       }
    });
}, null, true, 'Europe/Rome');
job.start();