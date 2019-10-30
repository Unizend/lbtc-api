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

// Returns the parsed path for Localbitcoins API Auth requirements
const parsePath = (path, public_api = false) => {
	path = (public_api === true) ? '/' + path : '/api/' + path + '/'

	return path
}

// Here's where the magic happends
const lbtcs = {
	// Get Method for Localbitcoins API
	get: async (path, public_api = false) => {
		path = parsePath(path, public_api)
		const headers = getHeaders(path)
		const res = await fetch(ROOT_URL + path, { method: 'GET', headers })

		return res.json()
	},
	// Post Method for localbitcoins API
	post: async (path, params) => {
		path = parsePath(path)
		const headers = getHeaders(path, params)
		const res = await fetch(ROOT_URL + path, {
			method: 'POST',
			body: querystring.stringify(payload),
			headers
		})

		return res.json()
	},
	payment_methods: {	
		/**
		 * Returns a list of valid payment methods
		 * @param countrycode Valid country code
		 * @returns {*} list of valid payment methods
		 */
		getList: async (countrycode = null) => {
			let response = null
			let path = 'payment_methods'
			let setCountrycode = countrycode => path + `/${countrycode}`

			if (countrycode === null) {
				response = await lbtcs.get(path)
			} else {
				response = await lbtcs.get(
					setCountrycode(countrycode)
				)
			}

			return response
		}
	},
	countrycodes: {
		/**
		 * Get a list of valid countrycodes
		 * @returns {*} list of valid countrycodes
		 */
		getList: async () => {
			let path = 'countrycodes'
			let response = await lbtcs.get(path)

			return response
		}
	},
	currencies: {
		/**
		 * Returns a list of valid and recognized FIAT currencies
		 * @returns {*} list of currencies
		 */
		getList: async () => {
			let path = 'currencies'
			let response = await lbtcs.get(path)

			return response
		}
	},
	places: {
		paths: {
			base: 'places'
		},
		getInfo: async () => {
			// TODO

			console.log('Looks up places near lat, lon and provides full URLs to buy and sell listings')
		}
	},
	equation: {
		/**
		 * Calculates the current price for BTC with the specified equation
		 * @param equation_string Valid Equation
		 * @returns {string} price for BTC
		 */
		getPrice: async (equation_string) => {
			let path = 'equation'
			let setEquation = equation_string => path +`/${equation_string}`
			let response = await lbtcs.get(
				setEquation(equation_string)
			)

			return response
		},
	},
	ads: {
		getMine: async () => {
			let path = 'ads'
			let response = await lbtcs.get(path)

			return response
		},
		getById: async (ad_id) => {
			let path = 'add-get'
			let setId = ad_id => path + `/${ad_id}`

			let response = await lbtcs.get(
				setId(ad_id)
			)
			return response
		},
		action: async (type, ad_id = null) => {
			let suffix = (type === 'update') ? '' : '-' + type
			let path = 'ad' + suffix
			let setId = ad_id =>  `ad/${ad_id}`

			switch (type) {
				case 'update':
					console.log('Update an advertisement')
					break
				case 'create':
					console.log('Create a new advertisement')
					break
				case 'equation':
					console.log('Update equation of an advertisement')
					break
				case 'remove':
					console.log('Remove an advertisement')
					break
			}
		}
	},
	contact: {
		paths: {
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
		feedbackTo: async (username) => {
			// TODO

			console.log('Gives feedback to a user')
		},
		releaceBTC: async (contact_id, pin = false) => {
			// TODO

			console.log('Release BTC. Pin: Optional')
		},
		markAsPaid: async (contact_id) => {
			// TODO

			console.log('mark a trade as paid')
		},
		chat: {
			getMessages: async (contact_id) => {
				// TODO

				console.log('Returns all chat messages from an specific contact id')
			},
			postMessage: async (contact_id) => {
				// TODO

				console.log('Post a message to a specific contact id')
			}
		},
		dispute: async (contact_id) => {
			// TODO

			console.log('Starts a dispute on a contact id')
		},
		cancel: async (contact_id) => {
			// TODO

			console.log('Cancel a trade')
		},
		mark: {
			realname: async (contact_id) => {
				// TODO

				console.log('Mark realname confirmation')
			},
			identified: async (contact_id) => {
				// TODO

				console.log('Mark verification of trade partner as confirmed')
			}
		},
		create: async (ad_id) => {
			// TODO

			console.log('Start a trade from advertisement')
		},
		info: async (contact_id) => {
			// TODO

			console.log('Returns informations about a single trade id')
		}
	},
	account: {
		paths: {
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
		getInfo: async (username) => {
			let path = 'account_info'
			let setUsername =  username => path + `/${username}`
			let response = await lbtcs.get(
				setUsername(username)
			)

			return response
		},
		getDashbord: async () => {
			// TODO

			console.log('Returns open and active trades')
		},
		trades: {
			getReleased: async () => {
				// TODO

				console.log('Returns released trades')
			},
			getCanceled: async () => {
				// TODO

				console.log('Returns canceled trades')
			},
			getClosed: async () => {
				// TODO

				console.log('Returns closed trades')
			}
		},
		logout: async () => {
			// TODO

			console.log('Immediately expires the current access token')
		},
		myself: async () => {
			// TODO

			console.log('Returns the information of the authenticated user')
		},
		notifications: {
			list: async () => {
				// TODO

				console.log('Returns a list of notifications')
			},
			markAsRead: async (notification_id) => {
				// TODO

				console.log('Mark a especific notification as read')
			}
		},
		pincode: async () => {
			// TODO

			console.log('Checks the given PIN code against the user\'s currently active PIN code')
		},
		realNameVerifiers: async (username) => {
			// TODO

			console.log('Returns a list of real name verifiers of the user')
		},
		recentMsjs: async () => {
			// TODO

			console.log('Returns the 50 latest trade messages')
		}
	},
	wallet: {
		paths: {
			info: 'wallet',
			balance: 'wallet-balance',
			send: 'wallet-send',
			send_pin: 'wallet-send-pin',
			addr: 'wallet-addr',
			fees: 'fees'
		}
	},
	public_api: {
		paths: {
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
		},
		buyOnline: async (params = {}) => {
			let path = 'buy-bitcoins-online/.json'

			let cPm = (currency, payment_method) => `buy-bitcoins-online/${currency}/${payment_method}/.json`
			let ccCnPm = (countrycode, country_name, payment_method) => `buy-bitcoins-online/${countrycode}/${country_name}/${payment_method}/.json`

			let response = null

			if (params.currency && params.payment_method) {
				response = await lbtcs.get(cPm(params.currency, params.payment_method), true)
			} else if (params.countrycode && params.country_name && params.payment_method) {
				response = await lbtcs.get(ccCnPm(params.countrycode, params.country_name, params.payment_method), true)
			} else {
				response = await lbtcs.get(path, true)
			}

			return response
		},
		sellOnline: async (params = {}) => {
			let path = 'sell-bitcoins-online/.json'

			let c = (currency) => `sell-bitcoins-online/${currency}/.json`

			let response = null

			if (params.currency) {
				response = await lbtcs.get(c(params.currency), true)
			} else {
				response = await lbtcs.get(path, true)
			}

			return response
		}
	}
}

module.exports = lbtcs