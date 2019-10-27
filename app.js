const request = require('request') // To make tests

const config = require('./config.json') // Config file

const ROOT_URL = 'https://localbitcoins.com'
const KEY = config.auth.key
const SECRET = config.auth.secret
const DEFAULT_HEADERS = {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Apiauth-Key': KEY
}

// Testing Localbitcoins API Payment Methods
/*const payment_methods = request('https://localbitcoins.com/api/payment_methods/', function(err, res, data) {

	console.log(res.statusCode);
	if (!err && res.statusCode == 200) {
		console.log(data);
	}
});*/