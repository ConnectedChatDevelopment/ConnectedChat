const express = require('express');
const bodyParser = require('body-parser');

const Database = require('./database.js');
const Mailer = require('./mailer.js');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/public'));

app.post('/login', (req, res) => {
    if (!req.body.userName || !req.body.password) {
        return res.sendStatus(403);
    }

    var db = new Database();

    db.getUser(req.body.userName, function (user) {
        if (!user || user.password != req.body.password)
            res.sendStatus(403);
        else
            res.sendStatus(200);
    });
});
app.post('/register', (req, res) => {
    var db = new Database();

    db.registerUser(req.body.username, req.body.password, req.body.email, function (result) {
        if (result.success) {
            var mailer = new Mailer();
            mailer.sendMail(result.user.email, function (error, result, fullResult) {
                console.error(error);
            });
            res.status(200).send(result.user);
        }
        else {
            res.status(500);

            if (result.error.code == 'ER_DUP_ENTRY') {
                res.send({
                    errorCode: "ER_DUP_ENTRY",
                    errorMessage: "User already exists."
                });
            }
            else {
                res.send({
                    errorCode: "OTHER",
                    errorMessage: "Server error."
                });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});