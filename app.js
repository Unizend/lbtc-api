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
	},
	post: async (path, params) => {
		const headers = getHeaders(path, params)
		const res = await fetch(ROOT_URL + path, {
			method: 'POST',
			body: querystring.stringify(payload),
			headers
		})

		return res.json()
	}
}

// Paths
const paths = {
	ADS: {
		my_ads: '/api/ads/',
		adById: ad_id => `/api/ad-get/${ad_id}/`,
		adsListByIds: ads_ids => `/api/ad-get/${ads_ids}/`, // TODO: Make it work
		updateAd: ad_id => `/api/ad/${ad_id}/`, // TODO
		createAd: '/api/ad-create/', // TODO
		updateAdEquation: ad_id => `/api/ad-equation/${ad_id}/`, // TODO
		removeAd: ad_id => `/api/ad-delate/${ad_id}/`, // TODO
		payment_methods: '/api/payment_methods/',
		countryPaymentMethods: countrycode => `/api/payment_methods/${countrycode}/`,
		countrycodes: '/api/countrycodes/',
		currencies: '/api/currencies/',
		places: '/api/places/', // Not working yet (Missing arguments). TODO: Make it work
		equation: equation_string => `/api/equation/${equation_string}/`, // TODO: review the localbitcoins equation guide
	}
}

const getMyAds = async () => {
	const response = await api.get(paths.ADS.my_ads)
	console.log(response.data.ad_list)
}

// getMyAds()

const getAdById = async (ad_id) => {
	const response = await api.get(
		paths.ADS.adById(ad_id)
	)
	console.log(response.data.ad_list)
}

// getAdById('975638')

// TODO: getAdsListByIds()

// TODO: updateAd()

// TODO: createAd()

// TODO: updateEquation()

// TODO: removeAd()

// Test using the api method to get the payment methods.
const getPaymentMethods = async (countrycode = null) => {
	let response = null

	if (countrycode != null) {
		response = await api.get(paths.ADS.countryPaymentMethods(countrycode))
	} else {
		response = await api.get(paths.ADS.payment_methods)
	}

	console.log(response)
}

// getPaymentMethods()

// getPaymentMethods('ve')

// Testin countrycodes
const getCountrycodes = async () => {
	const response = await api.get(paths.ADS.countrycodes)
	console.log(response);
}

// getCountrycodes()

// Testing Currencies
const getCurrencies = async () => {
	const response = await api.get(paths.ADS.currencies)
	console.log(response)
}

// getCurrencies()

// TODO: getPlaces()

// Testing equations
const getEquation = async (equation_string = null) => {
	let response = null

	if (equation_string != null) {
		response = await api.get(paths.equation(equation_string)) 
	} else {
		response = 'You need to specify an equation string'
	}
	console.log(response)
}

// getEquation('btc_in_usd*0.9')

// Testing Localbitcoins API Payment Methods
/*const payment_methods = request('https://localbitcoins.com/api/payment_methods/', function(err, res, data) {

	console.log(res.statusCode);
	if (!err && res.statusCode == 200) {
		console.log(data);
	}
});*/