"use strict";

const querystring = require('querystring')
const fetch = require('node-fetch')
const crypto = require('crypto')

const UzLBTCsClient = {}

UzLBTCsClient.init = (key, secret) => {
	UzLBTCsClient.key = key
	UzLBTCsClient.secret = secret
	UzLBTCsClient.rootUrl = 'https://localbitcoins.com'
	UzLBTCsClient.defaulHeaders = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Apiauth-Key': UzLBTCsClient.key
	}
}

UzLBTCsClient.parsePath = (path, publicApi = false) => {
	path = (publicApi === true) ? '/' + path : '/api/' + path + '/'

	return path
}

UzLBTCsClient.getMessageSignature = (path, params, nonce) => {
	const postParameters = querystring.stringify(params)
	const message = nonce + UzLBTCsClient.key + path + postParameters

	return crypto
		.createHmac('sha256', UzLBTCsClient.secret)
		.update(message)
		.digest('hex')
		.toUpperCase()
}

UzLBTCsClient.getHeaders = (path, params = {}) => {
	let nonce = new Date() * 1000
	let signature = UzLBTCsClient.getMessageSignature(path, params, nonce)

	return {
		...UzLBTCsClient.defaulHeaders,
		...{ 'Apiauth-Nonce': nonce, 'Apiauth-Signature': signature }
	}
}

UzLBTCsClient.get = async (path, publicApi = false) => {
	path = UzLBTCsClient.parsePath(path, publicApi)
	const headers = UzLBTCsClient.getHeaders(path, {})
	const res = await fetch(UzLBTCsClient.rootUrl + path, { method: 'GET', headers })

	console.log('Request to ' + UzLBTCsClient.rootUrl + path)

	return res.json()
}

UzLBTCsClient.post = async (path, params) => {
	path = UzLBTCsClient.parsePath(path)
	const headers = UzLBTCsClient.getHeaders(path, params)
	const res = await fetch(UzLBTCsClient.rootUrl + path, {
		method: 'POST',
		body: querystring.stringify(payload),
		headers
	})

	console.log('Request to ' + UzLBTCsClient.rootUrl + path)

	return res.json()
},

UzLBTCsClient.apiPaths = {
	paymentMethods: 'payment_methods',
	countryCodes: 'countrycodes',
	currencies: 'currencies',
	places: 'places', // TODO Looks up places near lat, lon and provides full URLs to buy and sell listings
	equation: 'equation',
	fees: 'fees',
	ads: 'ads',
	adGet: 'ad-get',
	adUpdate: 'ad-update',
	adCreate: 'ad-create',
	adEquation: 'ad-equation',
	adRemove: 'ad-remove',
	feedback: 'feedback',
	contact: 'contact_',
	account_info: 'account_info',
	myself: 'myself',
	dashbord: 'dashbord',
	notifications: 'notifications',
	recentMessages: 'recent_messages',
	realNameVerifiers: 'real_name_verifiers',
	pincode: 'pincode',
	logout: 'logout',
	walletInfo: 'wallet',
	walletBalance: 'wallet-balance',
	walletSend: 'wallet-send',
	walletSendPin: 'wallet-send-pin',
	walletAddr: 'wallet-addr',
}

/**
 * Localbitcoins public data
 */
UzLBTCsClient.localbitcoins = {
	getPaymentMethodsList: async (countryCode = null) => {
		let response = null
		let path = UzLBTCsClient.apiUzLBTCsClient.apiPaths.paymentMethods

		let setCountryCode = countryCode => path + `/${countryCode}`

		if (countryCode === null) {
			response = await UzLBTCsClient.get(path)
		} else {
			response = await UzLBTCsClient.get(
				setCountryCode(countryCode)
			)
		}

		return response.data.methods
	},
	getPaymentMethod: async (paymentMethod, countryCode = null) => {
		let response = await UzLBTCsClient.localbitcoins.getPaymentMethodsList(countryCode)

		return response[paymentMethod]
	},
	getCountryCodes: async () => {
		let path = UzLBTCsClient.apiUzLBTCsClient.apiPaths.countryCodes
		let response = await UzLBTCsClient.get(path)

		return response.data.cc_list
	},
	// TODO Add the possibility to get an specific currency
	getCurrencies: async () => {
		let path = UzLBTCsClient.apiUzLBTCsClient.apiPaths.currencies
		let response = await UzLBTCsClient.get(path)

		return response.data.currencies
	},
	// TODO
	getPlaces: async () => {
		let path = UzLBTCsClient.apiUzLBTCsClient.apiPaths.places

		return path
	},
	// TODO Review, something is wrong here
	getBTCPriceFromEquation: async (equationString) => {
		let path = UzLBTCsClient.apiUzLBTCsClient.apiPaths.equation

		let setEquation = equationString => path +`/${equationString}`

		path = setEquation(equationString)

		let response = await UzLBTCsClient.get(path)

		return response
	},
	// TODO
	getFees: async () => {
		let path = UzLBTCsClient.apiUzLBTCsClient.apiPaths.fees

		return path
	}
}

UzLBTCsClient.ads = {
	setId: (path, adId) => path + `/${adId}`,
	// TODO Review when id provided
	get: async (adId = null) => {
		let path = (adId == null) ? UzLBTCsClient.apiPaths.ads : UzLBTCsClient.ads.setId(UzLBTCsClient.apiUzLBTCsClient.apiPaths.adGet, adId)

		let response = await UzLBTCsClient.get(path)

		return response.data.ad_list
	},
	// TODO
	update: async (adId) => {
		let path = UzLBTCsClient.ads.setId(UzLBTCsClient.apiUzLBTCsClient.apiPaths.ad_update, adId)

		console.log('Update an advertisement')

		return path
	},
	//TODO
	create: async () => {
		let path = UzLBTCsClient.apiPaths.ad_create

		console.log('Create a new advertisement')

		return path
	},
	// TODO
	updateEquation: async (adId) => {
		let path = UzLBTCsClient.ads.setId(UzLBTCsClient.apiPaths.ad_equation, adId)

		console.log('Update equation of an advertisement')

		return path
	},
	//TODO
	remove: async (adId) => {
		let path = UzLBTCsClient.ads.setId(UzLBTCsClient.apiPaths.ad_remove, adId)

		console.log('Remove an advertisement')

		return path
	}
}

UzLBTCsClient.trades = {
	setPath: (path, value) => path + `/${value}`,
	// TODO
	giveFeedbackTo: async (username) => {
		let path = UzLBTCsClient.trades.setPath(UzLBTCsClient.apiPaths.feedback, username)

		console.log('Gives feedback to a user')

		return path
	},
	// TODO
	info: async (contactId = null) => {
		let base_path = UzLBTCsClient.apiPaths.contact + 'info'
		let path = (contactId === null) ? base_path : UzLBTCsClient.trades.setPath(base_path, contactId)

		console.log('Returns informations about a single trade id')

		return path
	},
	// TODO
	create: async (adId) => {
		let path = UzLBTCsClient.trades.setPath(UzLBTCsClient.apiPaths.contact + 'create', adId)

		console.log('Start a trade from advertisement')

		return path
	},
	// TODO
	verify: async (type, contactId) => {
		let base_path = UzLBTCsClient.apiPaths.contact + 'mark_' + type
		let path = UzLBTCsClient.trades.setPath(base_path, contactId)

		return path
	},
	// TODO
	getMsgs: async (contactId) => {
		let path = UzLBTCsClient.trades.setPath(UzLBTCsClient.apiPaths.contact + 'messages', contactId)

		return path
	},
	// TODO
	postMsg: async (contactId) => {
		let path = UzLBTCsClient.trades.setPath(UzLBTCsClient.apiPaths.contact + 'message_post', contactId)

		return path
	},
	// TODO
	paid: async (contactId) => {
		let path = UzLBTCsClient.trades.setPath(UzLBTCsClient.apiPaths.contact + 'mark_as_paid', contactId)

		return path
	},
	// TODO
	releaseBTC: async (contactId) => {
		let path = UzLBTCsClient.trades.setPath(UzLBTCsClient.apiPaths.contact + 'release', contactId)

		return path
	},
	// TODO
	cancel: async (contactId) => {
		let path = UzLBTCsClient.trades.setPath(UzLBTCsClient.apiPaths.contact + 'cancel', contactId)

		return path
	},
	// TODO
	dispute: async (contactId) => {
		let path = UzLBTCsClient.trades.setPath(UzLBTCsClient.apiPaths.contact + 'dispute', contactId)

		return path
	}
}

UzLBTCsClient.account = {
	getUserInfo: async (username) => {
		let path = UzLBTCsClient.apiPaths.account_info + `/${username}`
		let response = await UzLBTCsClient.get(path)

		return response.data
	},
	myself: async () => {
		let path = UzLBTCsClient.apiPaths.myself
		let response = await UzLBTCsClient.get(path)

		return response.data
	},
	// TODO
	dashbord: {
		info: async () => {
			let path = UzLBTCsClient.apiPaths.dashbord

			return path
		},
		released: async () => {
			let path = UzLBTCsClient.apiPaths.dashbord + '/released'

			return path
		},
		canceled: async () => {
			let path = UzLBTCsClient.apiPaths.dashbord + '/canceled'

			return path
		},
		closed: async () => {
			let path = UzLBTCsClient.apiPaths.dashbord + '/closed'

			return path
		}
	},
	// TODO
	notifications: {
		getList: async () => {
			let path = UzLBTCsClient.apiPaths.notifications

			return path
		},
		markAsRead: async (notificationId) => {
			let path = UzLBTCsClient.apiPaths.notifications + '/mark_as_read/' + notificationId

			return path
		}
	},
	// TODO
	getRecentMsgs: async () => {
		let path = UzLBTCsClient.apiPaths.recentMessages

		return path
	},
	// TODO
	getRealNameVerifiers: async (username) => {
		let path = UzLBTCsClient.apiPaths.real_name_verifiers + `/${username}`

		return path
	},
	// TODO
	pincode: async () => {
		let path = UzLBTCsClient.apiPaths.pincode

		return path
	},
	// TODO
	logout: async () => {
		let path = UzLBTCsClient.apiPaths.logout

		return path
	}
}

UzLBTCsClient.wallet = {
	// TODO
	getInfo: async () => {
		let path = UzLBTCsClient.apiPaths.walletInfo

		return path
	},
	// TODO
	getBalance: async () => {
		let path = UzLBTCsClient.apiPaths.walletBalance

		return path
	},
	// TODO
	send: async () => {
		let path = UzLBTCsClient.apiPaths.walletSend

		return path
	},
	// TODO
	sendPin: async () => {
		let path = UzLBTCsClient.apiPaths.walletSendPin

		return path
	},
	// TODO
	getAddr: async () => {
		let path = UzLBTCsClient.apiPaths.walletAddr

		return path
	}
}

/**
 * Access Localbitcoins public market data
 */
UzLBTCsClient.publicMarketData = {
	/**
	 * Selling and Buying ads list
	 * 
	 * Posible Path to test // TODO Test each path
	 * /buy-bitcoins-online/.json
	 * /buy-bitcoins-online/${payment_method}/.json
	 * /buy-bitcoins-online/${currency}/.json
	 * /buy-bitcoins-online/${currency}/${payment_method}/.json
	 * /buy-bitcoins-online/${countrycode}/${country_name}/.json
	 * /buy-bitcoins-online/${countrycode}/${country_name}/${payment_method}/.json
	 * /buy-bitcoins-with-cash/{location_id}/{location_slug}/.json // TODO
	 * /sell-bitcoins-online/.json
	 * /sell-bitcoins-online/${payment_method}/.json
	 * /sell-bitcoins-online/${currency}/.json
	 * /sell-bitcoins-online/${currency}/${payment_method}/.json
	 * /sell-bitcoins-online/${countrycode}/${country_name}/.json
	 * /sell-bitcoins-online/${countrycode}/${country_name}/${payment_method}/.json
	 * /sell-bitcoins-with-cash/{location_id}/{location_slug}/.json // TODO
	 */
	adsList: async (action, options, page) => {
		let prefix = action + '-'

		//console.log(options)

		let countryCode = (options.countryCode) ? options.countryCode : false
		let countryName = (options.countryName) ? options.countryName : false
		let paymentMethod = (options.paymentMethod) ? options.paymentMethod : false
		
		let basePath = prefix + 'bitcoins-online'
		let suffix = (page > 1) ? `.json?page=${page}` : '.json'

		let path = (paymentMethod) ? `${basePath}/${countryCode}/${countryName}/${paymentMethod}/${suffix}` : `${basePath}/${countryCode}/${countryName}/${suffix}`

		//console.log(path);
		let response = await UzLBTCsClient.get(path, true)

		//console.log(response.data.ad_list)

		return response.data.ad_list


	},
	bitcoinAverage: async () => {
		let path = 'bitcoinaverage/ticker-all-currencies/'

		let response = await UzLBTCsClient.get(path, true)

		return response
	},
	bitcoinCharts: {
		trades: async (currency) => {
			let path = 'bitcoincharts/' + currency + '/trades.json'

			let response = await UzLBTCsClient.get(path, true)

			return response
		},
		orderBooks: async (currency) => {
			let path = 'bitcoincharts/' + currency + '/orderbook.json'

			let response = await UzLBTCsClient.get(path, true)

			return response
		}
	}
}

module.exports = UzLBTCsClient