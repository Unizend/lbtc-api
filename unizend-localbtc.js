"use strict";

const querystring = require('querystring')
const fetch = require('node-fetch')
const crypto = require('crypto')

const UnizendLocalBTC = {}

UnizendLocalBTC.init = (key, secret) => {
	UnizendLocalBTC.key = key
	UnizendLocalBTC.secret = secret
	UnizendLocalBTC.rootUrl = 'https://localbitcoins.com'
	UnizendLocalBTC.defaulHeaders = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Apiauth-Key': UnizendLocalBTC.key
	}
}

UnizendLocalBTC.parsePath = (path, publicApi = false) => {
	path = (publicApi === true) ? '/' + path : '/api/' + path + '/'

	return path
}

UnizendLocalBTC.getMessageSignature = (path, params, nonce) => {
	const postParameters = querystring.stringify(params)
	const message = nonce + UnizendLocalBTC.key + path + postParameters

	return crypto
		.createHmac('sha256', UnizendLocalBTC.secret)
		.update(message)
		.digest('hex')
		.toUpperCase()
}

UnizendLocalBTC.getHeaders = (path, params = {}) => {
	let nonce = new Date() * 1000
	let signature = UnizendLocalBTC.getMessageSignature(path, params, nonce)

	return {
		...UnizendLocalBTC.defaulHeaders,
		...{ 'Apiauth-Nonce': nonce, 'Apiauth-Signature': signature }
	}
}

UnizendLocalBTC.get = async (path, publicApi = false) => {
	path = UnizendLocalBTC.parsePath(path, publicApi)
	const headers = UnizendLocalBTC.getHeaders(path, {})
	const res = await fetch(UnizendLocalBTC.rootUrl + path, { method: 'GET', headers })

	console.log('Request to ' + UnizendLocalBTC.rootUrl + path)

	return res.json()
}

UnizendLocalBTC.post = async (path, params) => {
	path = UnizendLocalBTC.parsePath(path)
	const headers = UnizendLocalBTC.getHeaders(path, params)
	const res = await fetch(UnizendLocalBTC.rootUrl + path, {
		method: 'POST',
		body: querystring.stringify(payload),
		headers
	})

	console.log('Request to ' + UnizendLocalBTC.rootUrl + path)

	return res.json()
},

UnizendLocalBTC.apiPaths = {
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
UnizendLocalBTC.localbitcoins = {
	getPaymentMethodsList: async (countryCode = null) => {
		let response = null
		let path = UnizendLocalBTC.apiUnizendLocalBTC.apiPaths.paymentMethods

		let setCountryCode = countryCode => path + `/${countryCode}`

		if (countryCode === null) {
			response = await UnizendLocalBTC.get(path)
		} else {
			response = await UnizendLocalBTC.get(
				setCountryCode(countryCode)
			)
		}

		return response.data.methods
	},
	getPaymentMethod: async (paymentMethod, countryCode = null) => {
		let response = await UnizendLocalBTC.localbitcoins.getPaymentMethodsList(countryCode)

		return response[paymentMethod]
	},
	getCountryCodes: async () => {
		let path = UnizendLocalBTC.apiPaths.countryCodes
		let response = await UnizendLocalBTC.get(path)

		return response.data.cc_list
	},
	// TODO Add the possibility to get an specific currency
	getCurrencies: async () => {
		let path = UnizendLocalBTC.apiPaths.currencies
		let response = await UnizendLocalBTC.get(path)

		return response.data.currencies
	},
	// TODO
	getPlaces: async () => {
		let path = UnizendLocalBTC.apiPaths.places

		return path
	},
	// TODO Review, something is wrong here
	getBTCPriceFromEquation: async (equationString) => {
		let path = UnizendLocalBTC.apiPaths.equation

		let setEquation = equationString => path +`/${equationString}`

		path = setEquation(equationString)

		let response = await UnizendLocalBTC.get(path)

		return response
	},
	// TODO
	getFees: async () => {
		let path = UnizendLocalBTC.apiPaths.fees

		return path
	}
}

UnizendLocalBTC.ads = {
	setId: (path, adId) => path + `/${adId}`,
	// TODO Review when id provided
	get: async (adId = null) => {
		let path = (adId == null) ? UnizendLocalBTC.apiPaths.ads : UnizendLocalBTC.ads.setId(UnizendLocalBTC.apiPaths.adGet, adId)

		let response = await UnizendLocalBTC.get(path)

		return response.data.ad_list
	},
	// TODO
	update: async (adId) => {
		let path = UnizendLocalBTC.ads.setId(UnizendLocalBTC.apiUnizendLocalBTC.apiPaths.ad_update, adId)

		console.log('Update an advertisement')

		return path
	},
	//TODO
	create: async () => {
		let path = UnizendLocalBTC.apiPaths.ad_create

		console.log('Create a new advertisement')

		return path
	},
	// TODO
	updateEquation: async (adId) => {
		let path = UnizendLocalBTC.ads.setId(UnizendLocalBTC.apiPaths.ad_equation, adId)

		console.log('Update equation of an advertisement')

		return path
	},
	//TODO
	remove: async (adId) => {
		let path = UnizendLocalBTC.ads.setId(UnizendLocalBTC.apiPaths.ad_remove, adId)

		console.log('Remove an advertisement')

		return path
	}
}

UnizendLocalBTC.trades = {
	setPath: (path, value) => path + `/${value}`,
	// TODO
	giveFeedbackTo: async (username) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.feedback, username)

		console.log('Gives feedback to a user')

		return path
	},
	// TODO
	info: async (contactId = null) => {
		let base_path = UnizendLocalBTC.apiPaths.contact + 'info'
		let path = (contactId === null) ? base_path : UnizendLocalBTC.trades.setPath(base_path, contactId)

		console.log('Returns informations about a single trade id')

		return path
	},
	// TODO
	create: async (adId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'create', adId)

		console.log('Start a trade from advertisement')

		return path
	},
	// TODO
	verify: async (type, contactId) => {
		let base_path = UnizendLocalBTC.apiPaths.contact + 'mark_' + type
		let path = UnizendLocalBTC.trades.setPath(base_path, contactId)

		return path
	},
	// TODO
	getMsgs: async (contactId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'messages', contactId)

		return path
	},
	// TODO
	postMsg: async (contactId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'message_post', contactId)

		return path
	},
	// TODO
	paid: async (contactId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'mark_as_paid', contactId)

		return path
	},
	// TODO
	releaseBTC: async (contactId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'release', contactId)

		return path
	},
	// TODO
	cancel: async (contactId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'cancel', contactId)

		return path
	},
	// TODO
	dispute: async (contactId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'dispute', contactId)

		return path
	}
}

UnizendLocalBTC.account = {
	getUserInfo: async (username) => {
		let path = UnizendLocalBTC.apiPaths.account_info + `/${username}`
		let response = await UnizendLocalBTC.get(path)

		return response.data
	},
	myself: async () => {
		let path = UnizendLocalBTC.apiPaths.myself
		let response = await UnizendLocalBTC.get(path)

		return response.data
	},
	// TODO
	dashbord: {
		info: async () => {
			let path = UnizendLocalBTC.apiPaths.dashbord

			return path
		},
		released: async () => {
			let path = UnizendLocalBTC.apiPaths.dashbord + '/released'

			return path
		},
		canceled: async () => {
			let path = UnizendLocalBTC.apiPaths.dashbord + '/canceled'

			return path
		},
		closed: async () => {
			let path = UnizendLocalBTC.apiPaths.dashbord + '/closed'

			return path
		}
	},
	// TODO
	notifications: {
		getList: async () => {
			let path = UnizendLocalBTC.apiPaths.notifications

			return path
		},
		markAsRead: async (notificationId) => {
			let path = UnizendLocalBTC.apiPaths.notifications + '/mark_as_read/' + notificationId

			return path
		}
	},
	// TODO
	getRecentMsgs: async () => {
		let path = UnizendLocalBTC.apiPaths.recentMessages

		return path
	},
	// TODO
	getRealNameVerifiers: async (username) => {
		let path = UnizendLocalBTC.apiPaths.real_name_verifiers + `/${username}`

		return path
	},
	// TODO
	pincode: async () => {
		let path = UnizendLocalBTC.apiPaths.pincode

		return path
	},
	// TODO
	logout: async () => {
		let path = UnizendLocalBTC.apiPaths.logout

		return path
	}
}

UnizendLocalBTC.wallet = {
	// TODO
	getInfo: async () => {
		let path = UnizendLocalBTC.apiPaths.walletInfo

		return path
	},
	// TODO
	getBalance: async () => {
		let path = UnizendLocalBTC.apiPaths.walletBalance

		return path
	},
	// TODO
	send: async () => {
		let path = UnizendLocalBTC.apiPaths.walletSend

		return path
	},
	// TODO
	sendPin: async () => {
		let path = UnizendLocalBTC.apiPaths.walletSendPin

		return path
	},
	// TODO
	getAddr: async () => {
		let path = UnizendLocalBTC.apiPaths.walletAddr

		return path
	}
}

/**
 * Access Localbitcoins public market data
 */
UnizendLocalBTC.publicMarketData = {
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
	adsList: async (action, options = {}, page) => {
		let prefix = action + '-'

		//console.log(options)

		let countryCode = (options.countryCode) ? options.countryCode : false
		let countryName = (options.countryName) ? options.countryName : false
		let paymentMethod = (options.paymentMethod) ? options.paymentMethod : false
		let currency = (options.currency) ? options.currency : false
		
		let basePath = prefix + 'bitcoins-online'
		let suffix = (page > 1) ? `.json?page=${page}` : '.json'

		let path

		if (currency) {
			path = (paymentMethod) ? `${basePath}/${currency}/${paymentMethod}/${suffix}` : `${basePath}/${currency}/${suffix}`
		}else if (countryCode && countryName) {
			path = (paymentMethod) ? `${basePath}/${countryCode}/${countryName}/${paymentMethod}/${suffix}` : `${basePath}/${countryCode}/${countryName}/${suffix}`
		} else if (!currency && !countryCode && !countryName) {
			path = (paymentMethod) ? `${basePath}/${paymentMethod}/${suffix}` : `${basePath}/${suffix}`
		}

		//console.log(path);
		let response = await UnizendLocalBTC.get(path, true)

		//console.log(response.data.ad_list)

		return response


	},
	bitcoinAverage: async () => {
		let path = 'bitcoinaverage/ticker-all-currencies/'

		let response = await UnizendLocalBTC.get(path, true)

		return response
	},
	bitcoinCharts: {
		trades: async (currency) => {
			let path = 'bitcoincharts/' + currency + '/trades.json'

			let response = await UnizendLocalBTC.get(path, true)

			return response
		},
		orderBooks: async (currency) => {
			let path = 'bitcoincharts/' + currency + '/orderbook.json'

			let response = await UnizendLocalBTC.get(path, true)

			return response
		}
	}
}

module.exports = UnizendLocalBTC