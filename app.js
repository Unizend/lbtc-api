var request = require('request');


// Testing Localbitcoins API Payment Methods
const payment_methods = request('https://localbitcoins.com/api/payment_methods/', function(err, res, data) {

	console.log(res.statusCode);
	if (!err && res.statusCode == 200) {
		console.log(data);
	}
});