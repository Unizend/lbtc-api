"use strict";

const querystring = require('querystring')
const fetch = require('node-fetch')
const crypto = require('crypto')

const UzLBTCsApi = {}

UzLBTCsApi.init = (key, secret) => {
	UzLBTCsApi.key = key
	UzLBTCsApi.secret = secret
	UzLBTCsApi.rootUrl = 'https://localbitcoins.com'
	UzLBTCsApi.defaulHeaders = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Apiauth-Key': UzLBTCsApi.key
	}
}

UzLBTCsApi.parsePath = (path, publicApi = false) => {
	path = (publicApi === true) ? '/' + path : '/api/' + path + '/'

	return path
}

UzLBTCsApi.getMessageSignature = (path, params, nonce) => {
	const postParameters = querystring.stringify(params)
	const message = nonce + UzLBTCsApi.key + path + postParameters

	return crypto
		.createHmac('sha256', UzLBTCsApi.secret)
		.update(message)
		.digest('hex')
		.toUpperCase()
}

UzLBTCsApi.getHeaders = (path, params = {}) => {
	let nonce = new Date() * 1000
	let signature = UzLBTCsApi.getMessageSignature(path, params, nonce)

	return {
		...UzLBTCsApi.defaulHeaders,
		...{ 'Apiauth-Nonce': nonce, 'Apiauth-Signature': signature }
	}
}

UzLBTCsApi.get = async (path, publicApi = false) => {
	path = UzLBTCsApi.parsePath(path, publicApi)
	const headers = UzLBTCsApi.getHeaders(path, {})
	const res = await fetch(UzLBTCsApi.rootUrl + path, { method: 'GET', headers })

	console.log('Request to ' + UzLBTCsApi.rootUrl + path)

	return res.json()
}

UzLBTCsApi.post = async (path, params) => {
	path = UzLBTCsApi.parsePath(path)
	const headers = UzLBTCsApi.getHeaders(path, params)
	const res = await fetch(UzLBTCsApi.rootUrl + path, {
		method: 'POST',
		body: querystring.stringify(payload),
		headers
	})

	console.log('Request to ' + UzLBTCsApi.rootUrl + path)

	return res.json()
},

UzLBTCsApi.apiPaths = {
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
UzLBTCsApi.localbitcoins = {
	getPaymentMethodsList: async (countryCode = null) => {
		let response = null
		let path = UzLBTCsApi.apiUzLBTCsApi.apiPaths.paymentMethods

		let setCountryCode = countryCode => path + `/${countryCode}`

		if (countryCode === null) {
			response = await UzLBTCsApi.get(path)
		} else {
			response = await UzLBTCsApi.get(
				setCountryCode(countryCode)
			)
		}

		return response.data.methods
	},
	getPaymentMethod: async (paymentMethod, countryCode = null) => {
		let response = await UzLBTCsApi.localbitcoins.getPaymentMethodsList(countryCode)

		return response[paymentMethod]
	},
	getCountryCodes: async () => {
		let path = UzLBTCsApi.apiUzLBTCsApi.apiPaths.countryCodes
		let response = await UzLBTCsApi.get(path)

		return response.data.cc_list
	},
	// TODO Add the possibility to get an specific currency
	getCurrencies: async () => {
		let path = UzLBTCsApi.apiUzLBTCsApi.apiPaths.currencies
		let response = await UzLBTCsApi.get(path)

		return response.data.currencies
	},
	// TODO
	getPlaces: async () => {
		let path = UzLBTCsApi.apiUzLBTCsApi.apiPaths.places

		return path
	},
	// TODO Review, something is wrong here
	getBTCPriceFromEquation: async (equationString) => {
		let path = UzLBTCsApi.apiUzLBTCsApi.apiPaths.equation

		let setEquation = equationString => path +`/${equationString}`

		path = setEquation(equationString)

		let response = await UzLBTCsApi.get(path)

		return response
	},
	// TODO
	getFees: async () => {
		let path = UzLBTCsApi.apiUzLBTCsApi.apiPaths.fees

		return path
	}
}

UzLBTCsApi.ads = {
	setId: (path, adId) => path + `/${adId}`,
	// TODO Review when id provided
	get: async (adId = null) => {
		let path = (adId == null) ? UzLBTCsApi.apiPaths.ads : UzLBTCsApi.ads.setId(UzLBTCsApi.apiUzLBTCsApi.apiPaths.adGet, adId)

		let response = await UzLBTCsApi.get(path)

		return response.data.ad_list
	},
	// TODO
	update: async (adId) => {
		let path = UzLBTCsApi.ads.setId(UzLBTCsApi.apiUzLBTCsApi.apiPaths.ad_update, adId)

		console.log('Update an advertisement')

		return path
	},
	//TODO
	create: async () => {
		let path = UzLBTCsApi.apiPaths.ad_create

		console.log('Create a new advertisement')

		return path
	},
	// TODO
	updateEquation: async (adId) => {
		let path = UzLBTCsApi.ads.setId(UzLBTCsApi.apiPaths.ad_equation, adId)

		console.log('Update equation of an advertisement')

		return path
	},
	//TODO
	remove: async (adId) => {
		let path = UzLBTCsApi.ads.setId(UzLBTCsApi.apiPaths.ad_remove, adId)

		console.log('Remove an advertisement')

		return path
	}
}

UzLBTCsApi.trades = {
	setPath: (path, value) => path + `/${value}`,
	// TODO
	giveFeedbackTo: async (username) => {
		let path = UzLBTCsApi.trades.setPath(UzLBTCsApi.apiPaths.feedback, username)

		console.log('Gives feedback to a user')

		return path
	},
	// TODO
	info: async (contactId = null) => {
		let base_path = UzLBTCsApi.apiPaths.contact + 'info'
		let path = (contactId === null) ? base_path : UzLBTCsApi.trades.setPath(base_path, contactId)

		console.log('Returns informations about a single trade id')

		return path
	},
	// TODO
	create: async (adId) => {
		let path = UzLBTCsApi.trades.setPath(UzLBTCsApi.apiPaths.contact + 'create', adId)

		console.log('Start a trade from advertisement')

		return path
	},
	// TODO
	verify: async (type, contactId) => {
		let base_path = UzLBTCsApi.apiPaths.contact + 'mark_' + type
		let path = UzLBTCsApi.trades.setPath(base_path, contactId)

		return path
	},
	// TODO
	getMsgs: async (contactId) => {
		let path = UzLBTCsApi.trades.setPath(UzLBTCsApi.apiPaths.contact + 'messages', contactId)

		return path
	},
	// TODO
	postMsg: async (contactId) => {
		let path = UzLBTCsApi.trades.setPath(UzLBTCsApi.apiPaths.contact + 'message_post', contactId)

		return path
	},
	// TODO
	paid: async (contactId) => {
		let path = UzLBTCsApi.trades.setPath(UzLBTCsApi.apiPaths.contact + 'mark_as_paid', contactId)

		return path
	},
	// TODO
	releaseBTC: async (contactId) => {
		let path = UzLBTCsApi.trades.setPath(UzLBTCsApi.apiPaths.contact + 'release', contactId)

		return path
	},
	// TODO
	cancel: async (contactId) => {
		let path = UzLBTCsApi.trades.setPath(UzLBTCsApi.apiPaths.contact + 'cancel', contactId)

		return path
	},
	// TODO
	dispute: async (contactId) => {
		let path = UzLBTCsApi.trades.setPath(UzLBTCsApi.apiPaths.contact + 'dispute', contactId)

		return path
	}
}

UzLBTCsApi.account = {
	getUserInfo: async (username) => {
		let path = UzLBTCsApi.apiPaths.account_info + `/${username}`
		let response = await UzLBTCsApi.get(path)

		return response.data
	},
	myself: async () => {
		let path = UzLBTCsApi.apiPaths.myself
		let response = await UzLBTCsApi.get(path)

		return response.data
	},
	// TODO
	dashbord: {
		info: async () => {
			let path = UzLBTCsApi.apiPaths.dashbord

			return path
		},
		released: async () => {
			let path = UzLBTCsApi.apiPaths.dashbord + '/released'

			return path
		},
		canceled: async () => {
			let path = UzLBTCsApi.apiPaths.dashbord + '/canceled'

			return path
		},
		closed: async () => {
			let path = UzLBTCsApi.apiPaths.dashbord + '/closed'

			return path
		}
	},
	// TODO
	notifications: {
		getList: async () => {
			let path = UzLBTCsApi.apiPaths.notifications

			return path
		},
		markAsRead: async (notificationId) => {
			let path = UzLBTCsApi.apiPaths.notifications + '/mark_as_read/' + notificationId

			return path
		}
	},
	// TODO
	getRecentMsgs: async () => {
		let path = UzLBTCsApi.apiPaths.recentMessages

		return path
	},
	// TODO
	getRealNameVerifiers: async (username) => {
		let path = UzLBTCsApi.apiPaths.real_name_verifiers + `/${username}`

		return path
	},
	// TODO
	pincode: async () => {
		let path = UzLBTCsApi.apiPaths.pincode

		return path
	},
	// TODO
	logout: async () => {
		let path = UzLBTCsApi.apiPaths.logout

		return path
	}
}

UzLBTCsApi.wallet = {
	// TODO
	getInfo: async () => {
		let path = UzLBTCsApi.apiPaths.walletInfo

		return path
	},
	// TODO
	getBalance: async () => {
		let path = UzLBTCsApi.apiPaths.walletBalance

		return path
	},
	// TODO
	send: async () => {
		let path = UzLBTCsApi.apiPaths.walletSend

		return path
	},
	// TODO
	sendPin: async () => {
		let path = UzLBTCsApi.apiPaths.walletSendPin

		return path
	},
	// TODO
	getAddr: async () => {
		let path = UzLBTCsApi.apiPaths.walletAddr

		return path
	}
}

/**
 * Access Localbitcoins public market data
 */
UzLBTCsApi.publicMarketData = {
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
		let response = await UzLBTCsApi.get(path, true)

		//console.log(response.data.ad_list)

		return response.data.ad_list


	},
	bitcoinAverage: async () => {
		let path = 'bitcoinaverage/ticker-all-currencies/'

		let response = await UzLBTCsApi.get(path, true)

		return response
	},
	bitcoinCharts: {
		trades: async (currency) => {
			let path = 'bitcoincharts/' + currency + '/trades.json'

			let response = await UzLBTCsApi.get(path, true)

			return response
		},
		orderBooks: async (currency) => {
			let path = 'bitcoincharts/' + currency + '/orderbook.json'

			let response = await UzLBTCsApi.get(path, true)

			return response
		}
	}
}

module.exports = UzLBTCsApi