const request = require('request') // To make tests
const querystring = require('querystring')
const fetch = require('node-fetch')
const crypto = require('crypto')

const config = require('./config.json') // Config file

const ROOT_URL = 'https://localbitcoins.com'
const KEY = config.auth.key
const SECRET = config.auth.secret
const DEFAULT_HEADERS = {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Apiauth-Key': KEY
}

// This returns a signature for a request as a Base64-encoded string
const getMessageSignature = (path, params, nonce) => {
	const postParameters = querystring.stringify(params)
	const message = nonce + KEY + path + postParameters

	return crypto
		.createHmac('sha256', SECRET)
		.update(message)
		.digest('hex')
		.toUpperCase()
}

// This returns http headers
const getHeaders = (path, params = {}) => {
	const nonce = new Date() * 1000
	const signature = getMessageSignature(path, params, nonce)

	return {
		...DEFAULT_HEADERS,
		...{ 'Apiauth-Nonce': nonce, 'Apiauth-Signature': signature }
	}
}

// Here's where the magic happends
const api = {
	get: async path => {
		const headers = getHeaders(path)
		const res = await fetch(ROOT_URL + path, { method: 'GET', headers })

		return res.json()
	}
}

// Paths
const paths = {
	PAYMENT_METHODS: '/api/payment_methods/',
	countryPaymentMethods: countrycode => `/api/payment_methods/${countrycode}/`,
	COUNTRYCODES: '/api/countrycodes/',
	CURRENCIES: '/api/currencies/'
}

// Test using the api method to get the payment methods.
const getPaymentMethods = async (countrycode = null) => {
	let response = null

	if (countrycode != null) {
		response = await api.get(paths.countryPaymentMethods(countrycode))
	} else {
		response = await api.get(paths.PAYMENT_METHODS)
	}

	console.log(response)
}

// Testin countrycodes
const getCountrycodes = async () => {
	const response = await api.get(paths.COUNTRYCODES)
	console.log(response);
}

// Testing Currencies
const getCurrencies = async () => {
	const response = await api.get(paths.CURRENCIES)
	console.log(response)
}

getCurrencies()

// Testing Localbitcoins API Payment Methods
/*const payment_methods = request('https://localbitcoins.com/api/payment_methods/', function(err, res, data) {

	console.log(res.statusCode);
	if (!err && res.statusCode == 200) {
		console.log(data);
	}
});*/