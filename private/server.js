// require('dotenv').config();
require('dotenv/config');

let express = require('express');
const nodemailer = require('nodemailer');
let CronJob = require('cron').CronJob;

let app = express();
let server = require('http').Server(app);
let path = require('path');
let bp = require('body-parser');
let mongoose = require('mongoose');
let request = require('request');

app.use(bp());
app.use('/', express.static(path.join(__dirname, '../')));

//database model and schema
let userSchema = mongoose.Schema({
    email: 'string'
});
let users = mongoose.model('Users', userSchema);

//database connection
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', function (error) {
    console.log(error);
});
db.once('open', function () {
    console.log("Connected to Database. \n");
});
let mailList = '';
//send email to all subs
users.find({}, {_id: 0, __v: 0}, function (err, data) {
    console.log("Subscribed users :");
    data.forEach(function (element) {
        // console.log(element.email);
        mailList += element.email + ',';
    });
    console.log(mailList);
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../index.html'));
    console.log("received get / request");
});

app.post('/sub', async function (req, res) {
    let new_user = new users({email: req.body.emailinput});
    await new_user.save(function (err) {
        if (err) console.log(err);
        else console.log("Added : " + req.body.emailinput);
    });

    res.redirect('/');
});

server.listen(8000);
console.log("server listening . . .");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});



let job = new CronJob('0 0 19 * * *', function() {
    //request lates data from api
    request('https://coronavirus-tracker-api.herokuapp.com/v2/latest', {json: true}, function (err, res, body) {
        if(err) {
            return console.log(err);
        }

        let mailOptions = {
            from: '"COVID-19 Tracker"coronatracker.noreply@gmail.com',
            to: 'savastrecosmingabriele@gmail.com',
            bcc: mailList,
            subject: 'Dati aggiornati per il '+ new Date().toLocaleDateString(),
            text: 'Numeri aggiornati',
            html: `<h1>Numeri aggiornati</h1><p>Confermati : ${body.latest.confirmed}</p><p>Decessi : ${body.latest.deaths}</p><p>Guariti : ${body.latest.recovered}</p>`
        };

        transporter.sendMail(mailOptions, function (error, data) {
            if(error){
                console.log("Errore nell'invio delle E-mail: ", error);
            } else {
                console.log("E-mail inviata con successo");
            }
        });
    });
}, null, true, 'Europe/Rome');
job.start();
