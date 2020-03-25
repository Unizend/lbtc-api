// Copyright (c) 2019 Santiago Rincón

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

"use strict";

// Node Denendencies
const querystring = require('querystring')
const fetch = require('node-fetch')
const crypto = require('crypto')

/**
 * unizend-localbtc Object object
 * 
 * Unizend's Node.js Localbitcoins API Client Library has been build to help
 * you access to the localbitcoins API from your Node.js project.
 * 
 * It provides a series of methods that hopefully will ease your development
 * with the Localbitcoins API using Node.js.
 * 
 * For more, explore the docs »
 * http://unizend-localbtc.us-east-1.elasticbeanstalk.com/
 */
const UnizendLocalBTC = {}

/**
 * Method to initialize the API
 * 
 * @since 1.0.0
 * 
 * @param key String
 * 	HMAC authentication key that you got when you created your HMAC
 * 	authentication from the localbitcoins apps dashboard.
 * 	https://localbitcoins.com/accounts/api/
 * @param secret String
 * 	Your API request signed with your HMAC secret that you got when you
 * 	create your HMAC authentication from the localbitcoins apps dashboard.
 * 	https://localbitcoins.com/accounts/api/
 */
UnizendLocalBTC.init = (key, secret) => {
	// Saves key and secret into the object for latter use
	UnizendLocalBTC.key = key
	UnizendLocalBTC.secret = secret
	// Saves the localbitcoins base url
	UnizendLocalBTC.rootUrl = 'https://localbitcoins.com'
	// Define Heders
	UnizendLocalBTC.defaulHeaders = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Apiauth-Key': UnizendLocalBTC.key
	}
}

/**
 * Ends the path behavior control process you start in the get method.
 * 
 * @since 1.0.0
 * 
 * @param path String
 * 	The path for the request
 * @param publicApi Boolean @default false
 * 	Controls the path behavior.
 * @param close Boolean @default true
 * 	If true ads a "/" at the end.
 * 	@since 1.2.4
 * 
 * @returns String | The API path
 */
UnizendLocalBTC.getUrl = (path, publicApi = false, close = true) => {
	// If true it means you are working with the public market data, so the
	// we it will not add the '/api/' prefix.
	// Else, it adds the prefix so there will be no errors in the paths.
	path = (close) ? `${path}/` : `${path}`
	path = (publicApi === true) ? '/' + path : '/api/' + path

	return path
}

/**
 * Generates a signature
 * 
 * @param path String
 * 	The localbitcoins API path that will be requested
 * @param params Object
 * 	Params for POST request
 * @param nonce Int
 * 	A numbere each time greater
 * 
 * @returns String | Encripted signature
 */
UnizendLocalBTC.getMessageSignature = (path, params, nonce) => {
	// Make param legible
	const postParameters = querystring.stringify(params)
	// Message for the signature
	const message = nonce + UnizendLocalBTC.key + path + postParameters

	return crypto
		.createHmac('sha256', UnizendLocalBTC.secret)
		.update(message)
		.digest('hex')
		.toUpperCase()
}

/**
 * Gets header
 * 
 * @since 1.0.0
 * 
 * @param path String
 * 	The path for the request
 * @param params Object
 * 	The objec with the request params.
 * 
 * @returns Object | Headers
 */
UnizendLocalBTC.getHeaders = (path, params = {}) => {
	// A unique number given with each API request. It's value needs to be greater
	// with each API request. https://localbitcoins.com/api-docs/
	let nonce = new Date() * 1000
	// Build the token
	let signature = UnizendLocalBTC.getMessageSignature(path, params, nonce)

	return {
		...UnizendLocalBTC.defaulHeaders,
		...{ 'Apiauth-Nonce': nonce, 'Apiauth-Signature': signature }
	}
}

/**
 * Makes a GET request to the localbitcoins API
 * 
 * @since 1.0.0
 * 
 * @param path String
 * 	The path for the request
 * @param publicApi Boolean @default false
 * 	When you are using the public market data from localbitcoins, the path
 * 	change a bit. For this reasson we have this var, to control that behavior.
 * @param params Objct @default {}
 * 	Query params
 * 	@since 1.2.2
 * @param close Objct @default true
 * 	To see if the path needs a "/" at the end.
 * 	@since 1.2.4
 * 
 * @returns Object | The localbitcoins API response
 */
UnizendLocalBTC.get = async (path, publicApi = false, params = {}, close = true) => {
	// gets the final path.
	path = UnizendLocalBTC.getUrl(path, publicApi, close)

	const headers = UnizendLocalBTC.getHeaders(path, params)

	if (Object.keys(params).length > 0) {
		const esc = encodeURIComponent;
		const query = Object.keys(params)
			.map(k => esc(k) + '=' + esc(params[k]))
			.join('&');
		path = `${path}?${query}`
	}
	
	const res = await fetch(UnizendLocalBTC.rootUrl + path, { method: 'GET', headers })

	console.log('Request to ' + UnizendLocalBTC.rootUrl + path)

	return res.json() // (res.ok) ? res.json() : { error: { status: res.status, statusText: res.statusText } }
}

/**
 * Makes a POST request to the localbitcoins API
 * 
 * @since 1.0.0
 * 
 * @param path String
 * 	The path for the request
 * @param params Object
 * 	Contains the param for the request
 * 
 * @returns Object | The localbitcoins API response
 */
UnizendLocalBTC.post = async (path, params) => {
	path = UnizendLocalBTC.getUrl(path)
	const headers = UnizendLocalBTC.getHeaders(path, params)
	const res = await fetch(UnizendLocalBTC.rootUrl + path, {
		method: 'POST',
		body: querystring.stringify(payload),
		headers
	})

	console.log('Request to ' + UnizendLocalBTC.rootUrl + path)

	return res.json()
},

/**
 * API paths list
 * 
 * @since 1.0.0
 */
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
 * Localbitcoins API public data
 * 
 * @since 1.0.0
 */
UnizendLocalBTC.localbitcoins = {
	/**
	 * Payment methods list
	 * 
	 * @since 1.0.0
	 */
	getPaymentMethodsList: async (countryCode = null) => {
		let response = null
		let path = UnizendLocalBTC.apiPaths.paymentMethods

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
	/**
	 * Get an specific payment method
	 * 
	 * @since 1.0.0
	 */
	getPaymentMethod: async (paymentMethod) => {
		let response = await UnizendLocalBTC.localbitcoins.getPaymentMethodsList()

		return response[paymentMethod]
	},
	/**
	 * Country Codes list
	 * 
	 * @since 1.0.0
	 */
	getCountryCodes: async () => {
		let path = UnizendLocalBTC.apiPaths.countryCodes
		let response = await UnizendLocalBTC.get(path)

		return response.data.cc_list
	},
	/**
	 * Currencies list
	 * 
	 * @since 1.0.0
	 * 
	 * TODO Add the possibility to get an specific currency
	 */
	getCurrencies: async () => {
		let path = UnizendLocalBTC.apiPaths.currencies
		let response = await UnizendLocalBTC.get(path)

		return response.data.currencies
	},
	// TODO
	getPlaces: async (coordinates = {}) => {
		let path = UnizendLocalBTC.apiPaths.places
		let response = await UnizendLocalBTC.get(path, false, coordinates)

		return response
	},
	/**
	 * BTC price from equation
	 * 
	 * @since 1.0.0
	 */
	// TODO Review, something is wrong here
	getBTCPriceFromEquation: async (equationString) => {
		let path = UnizendLocalBTC.apiPaths.equation

		let setEquation = equationString => path +`/${equationString}`

		path = setEquation(equationString)

		let response = await UnizendLocalBTC.get(path, false, {}, false)

		return response
	},
	// TODO
	getFees: async () => {
		let path = UnizendLocalBTC.apiPaths.fees

		let response = await UnizendLocalBTC.get(path)

		return response
	}
}

/**
 * Ads
 * 
 * @since 1.0.0
 */
UnizendLocalBTC.ads = {
	/**
	 * Ads the id to the path
	 * 
	 * @since 1.0.0
	 */
	setId: (path, adId) => path + `/${adId}`,
	/**
	 * Gets an ad
	 * 
	 * @since 1.0.0
	 */
	// TODO Review when id provided
	get: async (adId = null) => {
		let path = (adId == null) ? UnizendLocalBTC.apiPaths.ads : UnizendLocalBTC.ads.setId(UnizendLocalBTC.apiPaths.adGet, adId)

		let response = await UnizendLocalBTC.get(path)

		return response.data.ad_list
	},
	// TODO
	update: async (adId) => {
		let path = UnizendLocalBTC.ads.setId(UnizendLocalBTC.apiPaths.ad_update, adId)

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

/**
 * Trades
 * 
 * @since 1.0.0
 */
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

/**
 * Account
 * 
 * @since 1.0.0
 */
UnizendLocalBTC.account = {
	/**
	 * Gets the info of an specific user
	 * 
	 * @since 1.0.0
	 */
	getUserInfo: async (username) => {
		let path = UnizendLocalBTC.apiPaths.account_info + `/${username}`
		let response = await UnizendLocalBTC.get(path)

		return response.data
	},
	/**
	 * Gets my user info
	 * 
	 * @since 1.0.0
	 */
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

/**
 * Wallet
 * 
 * @since 1.0.0
 */
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
 * 
 * @since 1.0.0
 */
UnizendLocalBTC.publicMarketData = {
	/**
	 * Selling and Buying ads list
	 * 
	 * @since 1.0.0
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
		let suffix = (page  > 1) ? `.json?page=${page}` : '.json'

		let path

		if (currency) {
			path = (paymentMethod) ? `${basePath}/${currency}/${paymentMethod}/${suffix}` : `${basePath}/${currency}/${suffix}`
		} else if (countryCode && countryName) {
			path = (paymentMethod) ? `${basePath}/${countryCode}/${countryName}/${paymentMethod}/${suffix}` : `${basePath}/${countryCode}/${countryName}/${suffix}`
		} else if (!currency && !countryCode && !countryName) {
			path = (paymentMethod) ? `${basePath}/${paymentMethod}/${suffix}` : `${basePath}/${suffix}`
		}

		// console.log(page)

		let response = await UnizendLocalBTC.get(path, true)

		// console.log(response.pagination.next)

		return response


	},
	/**
	 * Get BTC Average price
	 * 
	 * @since 1.0.0
	 * 
	 * @param currency String
	 * 	Filters result by one of the currencies supported
	 * 	by localbitcoins @since 1.0.8
	 * @param time String
	 * 	Gets a specific timing @since 1.0.8
	 * 	Posible values: 1h, 6h, 12h, 24h; where the number is for the
	 * 	hours and the h means hours
	 */
	bitcoinAverage: async (currency = null, time = null) => {
		// Declares response
		let response
		// Sets the paths to be used
		let path = 'bitcoinaverage/ticker-all-currencies/'

		// Gets data from API
		let data = await UnizendLocalBTC.get(path, true)

		currency = (currency) ? currency.toUpperCase() : null

		response = (!data.error) ? (currency && data[currency]) ? (time) ? (data[currency]['avg_' + time]) ? data[currency]['avg_' + time] : (time === 'volume') ? data[currency].volume_btc : { error: `Invalid param "${time}"` } : data[currency] : (currency) ? { error: 'Use a valid currency' } : data : data

		return response
	},
	/**
	 * Get custom BTC Average prices list
	 * 
	 * @since 1.2.0
	 * 
	 * @param currencies Object
	 * 	List of currencies. Let's see an example
	 * 		currencies = {
	 * 			VES: '1h',			// Valid
	 * 			cop: 'volume',	// Valid
	 * 			Mxn: '12h',			// Valid
	 * 			USD: '22h',			// Invalid
	 * 			ZZZ: '12h'			// Invalid
	 * 		}
	 * 
	 * 		It doesn't matter if the currency is uppercase
	 * 		or not, but it has to be a valid currency.
	 * 
	 * 		valid currency values:
	 * 			1h, 6h, 12h, 24h: reurns the average price from the last n hours.
	 * 			volume: returns the averge BTC volume from the last 24h
	 */
	customBTCAvgList: async (currencies = {}) => {
		let response = {}
		let data = await UnizendLocalBTC.publicMarketData.bitcoinAverage()

		for (let currency in currencies) {
			currency = currency.toUpperCase()
			if (data[currency]) {
				if (data[currency]['avg_' + currencies[currency]]) {
					response[currency] =  { [currencies[currency]]: data[currency]['avg_' + currencies[currency]] }
				} else if (currencies[currency] === 'volume') {
					response[currency] = { volume: data[currency].volume_btc }
				} else if (currencies[currency] === 'all') {
					response = data[currency]
				} else {
					response[currency] = { error: 'invalid currency data' }
				}
			} else {
				response[currency] = { error: 'invalid currency' }
			}
		}

		return response
	},

	/**
	 * Bitcoin chars
	 * 
	 * @since 1.0.0
	 */
	bitcoinCharts: {
		/**
		 * Trades
		 * 
		 * @since 1.0.0
		 */
		trades: async (currency) => {
			let path = 'bitcoincharts/' + currency + '/trades.json'

			let response = await UnizendLocalBTC.get(path, true)

			return response
		},
		/**
		 * Order books
		 * 
		 * @since 1.0.0
		 */
		orderBooks: async (currency) => {
			let path = 'bitcoincharts/' + currency + '/orderbook.json'

			let response = await UnizendLocalBTC.get(path, true)

			return response
		}
	}
}

module.exports = UnizendLocalBTC