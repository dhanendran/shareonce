const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Secrets = require('./model/Secrets');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongo_uri = 'mongodb://localhost:27017/shareonce';
mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
	if (err) {
		console.log('Connection errror');
		throw err;
	} else {
		console.log(`Successfully connected to ${mongo_uri}`);
	}
});

function createURLHash() {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < 5; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

app.post('/api/save', (req, res) => {
	const { message, salt } = req.body;
	let urlHash = createURLHash();
	let expTime = new Date();
	expTime.setDate(expTime.getDate()+1);

	const secret = new Secrets({ urlHash, message, salt, expTime });
	secret.save(function(err, data) {
		if (err) {
			res.status(500).send("Error storing the data.");
		} else {
			res.status(200).send({
				success: true,
				urlHash: data.urlHash
			});
		}
  	});
});

app.get('/api/validate/:urlHash', (req, res) => {
	Secrets.findOne({urlHash: req.params.urlHash}, function(err, data) {
		if ( data ) {
			if ( data.salt ) {
				res.status(200).send({
					success: true,
					requireSalt: true
				});
			} else {
				res.status(200).send({
					success: true,
					requireSalt: false
				});
			}
		} else {
			res.status(200).send({
				success: false,
				message: 'Couldn\'t find your message' 
			});
		}
	});
});

app.get('/api/view/:urlHash/:salt?', (req, res) => {
	let salt = 'undefined' === typeof req.params.salt ? '' : req.params.salt;
	secret = new Secrets();
	Secrets.findOne({urlHash: req.params.urlHash, salt: salt}, function(err, data) {
		if ( data ) {
			let message = secret.decrypt( data.message, data.salt );

			data.remove();

			res.status(200).send({
				success: true,
				message: message
			});
		} else {
			res.status(400).send({
				success: false,
				message: 'Couldn\'t find your message' 
			});
		}
	});
});

app.post('/api/world', (req, res) => {
	console.log(req.body);
	res.send(
		`I received your POST request. This is what you sent me: ${req.body.message}`,
	);
});

app.get('/api/greeting', (req, res) => {
	const message = req.query.message || 'World';
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({ greeting: `Hello ${message}!` }));
});


app.listen(port, () => console.log(`Listening on port ${port}`));