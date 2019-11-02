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

const api = {
	// Get Method for Localbitcoins API
	get: async (path, public_api = false) => {
		path = parsePath(path, public_api)
		const headers = getHeaders(path, {}, true)
		const res = await fetch(ROOT_URL + path, { method: 'GET', headers })

		console.log('Request to ' + ROOT_URL + path)

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

		console.log('Request to ' + ROOT_URL + path)

		return res.json()
	},
}

const paths = {
	payment_methods: 'payment_methods',
	countrycodes: 'countrycodes',
	currencies: 'currencies',
	places: 'places', // TODO Looks up places near lat, lon and provides full URLs to buy and sell listings
	equation: 'equation',
	ads: 'ads',
	ad_get: 'ad-get',
	ad_update: 'ad-update',
	ad_create: 'ad-create',
	ad_equation: 'ad-equation',
	ad_remove: 'ad-remove',
	feedback: 'feedback',
	contact: 'contact_',
	account_info: 'account_info',
	myself: 'myself',
	dashbord: 'dashbord',
	notifications: 'notifications',
	recent_messages: 'recent_messages',
	real_name_verifiers: 'real_name_verifiers',
	pincode: 'pincode',
	logout: 'logout',
	wallet_info: 'wallet',
	wallet_balance: 'wallet-balance',
	wallet_send: 'wallet-send',
	wallet_send_pin: 'wallet-send-pin',
	wallet_addr: 'wallet-addr',
	fees: 'fees'
}

// Here's where the magic happends
const lbtcs = {
	get: async (path, public_api = false) => {
		return api.get(path, public_api)
	},
	post: async (path, params) => {
		return api.post(path, params)
	},
	getAPIPaths: () => {
		return paths
	},
	parsePath: (path, public_api = false) => {
		return parsePath(path, public_api)
	},
	localbitcoins: {
		getPaymentMethodsList: async (countrycode = null) => {
			let response = null
			let path = paths.payment_methods
			let setCountrycode = countrycode => path + `/${countrycode}`

			if (countrycode === null) {
				response = await api.get(path)
			} else {
				response = await api.get(
					setCountrycode(countrycode)
				)
			}

			return response.data.methods
		},
		getPaymentMethod: async (payment_method, countrycode = null) => {
			response = await lbtcs.localbitcoins.getPaymentMethodsList(countrycode)

			return response[payment_method]
		},
		getCountrycodes: async () => {
			let path = paths.countrycodes
			let response = await api.get(path)

			return response.data.cc_list
		},
		getCurrencies: async () => {
			let path = paths.currencies
			let response = await api.get(path)

			return response.data.currencies
		},
		getPlaces: async () => {
			let path = paths.places

			return path
		},
		getBTCPriceFromEquation: async (equation_string) => {
			let path = paths.equation

			let setEquation = equation_string => path +`/${equation_string}`

			let response = await api.get(
				setEquation(equation_string)
			)

			return response
		},
		getFees: async () => {
			let path = paths.fees

			return path
		}
	},
	ads: {
		setId: (path, ad_id) => path + `/${ad_id}`,
		get: async (ad_id = null) => {
			let path = (ad_id == null) ? paths.ads : lbtcs.ads.setId(paths.ad_get, ad_id)

			let response = await api.get(path)

			return response.data.ad_list
		},
		update: async (ad_id) => {
			let path = lbtcs.ads.setId(paths.ad_update, ad_id)

			console.log('Update an advertisement')

			return path
		},
		create: async () => {
			let path = paths.ad_create

			console.log('Create a new advertisement')

			return path
		},
		updateEquation: async (ad_id) => {
			let path = lbtcs.ads.setId(paths.ad_equation, ad_id)

			console.log('Update equation of an advertisement')

			return path
		},
		remove: async (ad_id) => {
			let path = lbtcs.ads.setId(paths.ad_remove, ad_id)

			console.log('Remove an advertisement')

			return path
		}
	},
	trades: {
		setPath: (path, value) => path + `/${value}`,
		giveFeedbackTo: async (username) => {
			let path = lbtcs.trades.setPath(paths.feedback, username)

			console.log('Gives feedback to a user')

			return path
		},
		info: async (contact_id = null) => {
			let base_path = paths.contact + 'info'
			let path = (contact_id === null) ? base_path : lbtcs.trades.setPath(base_path, contact_id)

			console.log('Returns informations about a single trade id')

			return path
		},
		create: async (ad_id) => {
			let path = lbtcs.trades.setPath(paths.contact + 'create', ad_id)

			console.log('Start a trade from advertisement')

			return path
		},
		verify: async (type, contact_id) => {
			let base_path = paths.contact + 'mark_' + type
			let path = lbtcs.trades.setPath(base_path, contact_id)

			return path
		},
		getMsgs: async (contact_id) => {
			let path = lbtcs.trades.setPath(paths.contact + 'messages', contact_id)

			return path
		},
		postMsg: async (contact_id) => {
			let path = lbtcs.trades.setPath(paths.contact + 'message_post', contact_id)

			return path
		},
		paid: async (contact_id) => {
			let path = lbtcs.trades.setPath(paths.contact + 'mark_as_paid', contact_id)

			return path
		},
		releaseBTC: async (contact_id) => {
			let path = lbtcs.trades.setPath(paths.contact + 'release', contact_id)

			return path
		},
		cancel: async (contact_id) => {
			let path = lbtcs.trades.setPath(paths.contact + 'cancel', contact_id)

			return path
		},
		dispute: async (contact_id) => {
			let path = lbtcs.trades.setPath(paths.contact + 'dispute', contact_id)

			return path
		}
	},
	account: {
		getUserInfo: async (username) => {
			let path = paths.account_info + `/${username}`
			let response = await api.get(path)

			return response.data
		},
		myself: async () => {
			let path = paths.myself
			let response = await api.get(path)

			return response.data
		},
		dashbord: {
			info: async () => {
				let path = paths.dashbord

				return path
			},
			released: async () => {
				let path = paths.dashbord + '/released'

				return path
			},
			canceled: async () => {
				let path = paths.dashbord + '/canceled'

				return path
			},
			closed: async () => {
				let path = paths.dashbord + '/closed'

				return path
			}
		},
		notifications: {
			getList: async () => {
				let path = paths.notifications

				return path
			},
			markAsRead: async (notification_id) => {
				let path = paths.notifications + '/mark_as_read/' + notification_id

				return path
			}
		},
		getRecentMsgs: async () => {
			let path = paths.recent_messages

			return path
		},
		getRealNameVerifiers: async (username) => {
			let path = paths.real_name_verifiers + `/${username}`

			return path
		},
		pincode: async () => {
			let path = paths.pincode

			return path
		},
		logout: async () => {
			let path = paths.logout

			return path
		}
	},
	wallet: {
		getInfo: async () => {
			let path = paths.wallet_info

			return path
		},
		getBalance: async () => {
			let path = paths.wallet_balance

			return path
		},
		send: async () => {
			let path = paths.wallet_send

			return path
		},
		sendPin: async () => {
			let path = paths.wallet_send_pin

			return path
		},
		getAddr: async () => {
			let path = paths.wallet_addr

			return path
		}
	},
	public_api: {
		adsList: async (action, countrycode, country_name, payment_method, page) => {
			let prefix = null

			switch (action) {
				case 'buying':
					prefix = 'buy-'
					break
				case 'selling':
					prefix = 'sell-'
					break
			}

			let base_path = prefix + 'bitcoins-online'
			let suffix = (page > 1) ? `.json?page=${page}` : '.json'

			let path = (payment_method) ? `${base_path}/${countrycode}/${country_name}/${payment_method}/${suffix}` : `${base_path}/${countrycode}/${country_name}/${suffix}`

			let response = await api.get(path, true)

			return response.data.ad_list
		},
		getBestAd: (ads, min_amount, currency) => {
			let best_ad

			for (i = 0; i < ads.length; i++) {
				if (ads[i].data.limit_to_fiat_amounts === '' || ads[i].data.limit_to_fiat_amounts === null) {
					if (parseInt(ads[i].data.min_amount) <= min_amount || parseInt(ads[i].data.min_amount) === null) {
						if (currency) {
							if (ads[i].data.currency === currency) {
								best_ad = ads[i].data
								break
							}
						} else {
							best_ad = ads[i].data
							break
						}
					}
				} else {
					best_ad = null
				}
			}

			return best_ad
		},
		getPrice: async options => {
			let best_ad, ads, price

			ads = await lbtcs.public_api.adsList(options.action, options.countrycode, options.country_name, options.payment_method, options.page)
			best_ad = await lbtcs.public_api.getBestAd(ads, options.min_amount, options.currency)

			price = (best_ad) ? best_ad.temp_price : null

			return price
		}
	}
}

module.exports = lbtcs