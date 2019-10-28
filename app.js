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
		const res = await fetch(ROOT_URL + '/api/' + path + '/', { method: 'GET', headers })

		return res.json()
	},
	post: async (path, params) => {
		const headers = getHeaders(path, params)
		const res = await fetch(ROOT_URL + '/api/' + path + '/', {
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
		my_ads: 'ads',
		adById: ad_id => `ad-get/${ad_id}`,
		adsListByIds: ads_ids => `ad-get/${ads_ids}`, // TODO: Make it work
		updateAd: ad_id => `ad/${ad_id}`, // TODO
		createAd: 'ad-create', // TODO
		updateAdEquation: ad_id => `ad-equation/${ad_id}`, // TODO
		removeAd: ad_id => `ad-delate/${ad_id}`, // TODO
		payment_methods: 'payment_methods',
		countryPaymentMethods: countrycode => `payment_methods/${countrycode}`,
		countrycodes: 'countrycodes',
		currencies: 'currencies',
		places: 'places', // Not working yet (Missing arguments). TODO: Make it work
		equation: equation_string => `equation/${equation_string}`, // TODO: review the localbitcoins equation guide
	},
	TRADES: {
		feedback: username => `feedback/${username}`, // TODO
		release: contact_id => `contact_release/${contact_id}`,
		releasePin: contact_id => `contact_release_pin/${contact_id}`,
		markAsPaid: contact_id => `contact_mark_as_paid/${contact_id}`,
		msjs: contact_id => `contact_messages/${contact_id}`,
		postMsj: contact_id => `contact_message_post/${contact_id}`,
		dispute: contact_id => `contact_dispute/${contact_id}`,
		cancel: contact_id => `contact_cancel/${contact_id}`,
		realNameConfirmation: contact_id => `contact_mark_realname/${contact_id}`,
		identifiedPartner: contact_id => `contact_mark_identified/${contact_id}`,
		startTrade: ad_id => `contact_create/${ad_id}`,
		tradeInfo: contact_id => `contact_info/${contact_id}`,
		my_trades_info: 'contact_info'
	},
	ACCOUNT: {
		accountInfo: username => `account_info/${username}`,
		dashbord: 'dashbord',
		released_trades: 'dashbord/released',
		canceled_trades: 'dashbord/canceled',
		closed_trades: 'dashbord/closed',
		logout: 'logout',
		myself: 'myself',
		notifications: 'notifications',
		markAsReadNotification: notification_id => `notifications/mark_as_read/${notification_id}`,
		pincode: 'pincode',
		realNameVerifiers: username => `real_name_verifiers/${username}`,
		recentMsjs: 'recent_messages'
	},
	WALLET: {
		info: 'wallet',
		balance: 'wallet-balance',
		send: 'wallet-send',
		send_pin: 'wallet-send-pin',
		addr: 'wallet-addr',
		fees: 'fees'
	},
	PUBLIC_MARKET_DATA: {
		buyWithCash: (location_id, location_slug) => `buy-bitcoins-with-cash/${location_id}/${location_slug}/.json`,
		sellForCash: (location_id, location_slug) => `sell-bitcoins-for-cash/${location_id}/${location_slug}/.json`,
		buyOnline: {
			ccCnPm: (countrycode, country_name, payment_method) => `buy-bitcoins-online/${countrycode}/${country_name}/${payment_method}/.json`,
			ccCn: (countrycode, country_name) => `buy-bitcoins-online/${countrycode}/${country_name}/.json`,
			cPm: (currency, payment_method) => `buy-bitcoins-online/${currency}/${payment_method}/.json`,
			c: (currency) => `buy-bitcoins-online/${currency}/.json`,
			pm: (payment_method) => `buy-bitcoins-online/${payment_method}/.json`,
			all: 'buy-bitcoins-online/.json',
		},
		sellOnline: {
			ccCnPm: (countrycode, country_name, payment_method) => `sell-bitcoins-online/${countrycode}/${country_name}/${payment_method}/.json`,
			ccCn: (countrycode, country_name) => `sell-bitcoins-online/${countrycode}/${country_name}/.json`,
			cPm: (currency, payment_method) => `sell-bitcoins-online/${currency}/${payment_method}/.json`,
			c: (currency) => `sell-bitcoins-online/${currency}/.json`,
			pm: (payment_method) => `sell-bitcoins-online/${payment_method}/.json`,
			all: 'sell-bitcoins-online/.json',
		},
		btcAverage: 'bitcoinaverage/ticker-all-currencies',
		btcChartsTrades: currency => `bitcoincharts/${currency}/trades.json`,
		btcChartsOrderbook: currency => `bitcoincharts/${currency}/orderbook.json`
	}
}

const getMyAds = async () => {
	const response = await api.get(paths.ADS.my_ads)
	console.log(response)
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

getPaymentMethods()

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