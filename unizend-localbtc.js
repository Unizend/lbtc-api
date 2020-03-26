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
 * @returns String | The API url
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
 * @returns Object Json | The localbitcoins API response
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
 * @returns Object Json | The localbitcoins API response
 */
UnizendLocalBTC.post = async (path, params) => {
	path = UnizendLocalBTC.getUrl(path)
	const headers = UnizendLocalBTC.getHeaders(path, params)
	const res = await fetch(UnizendLocalBTC.rootUrl + path, {
		method: 'POST',
		body: querystring.stringify(params),
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
	adUpdate: 'ad',
	adCreate: 'ad-create',
	adEquation: 'ad-equation',
	adDelete: 'ad-delete',
	feedback: 'feedback',
	contact: 'contact_',
	account_info: 'account_info',
	myself: 'myself',
	dashboard: 'dashboard',
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
	 * @param countryCode String @default null
	 * 	Valid country code of two length string
	 * 
	 * @see https://localbitcoins.com/api-docs/#payment-methods
	 * 
	 * @since 1.0.0
	 * 
	 * @returns Object Json |
	 * 	If countryCode: List of Payment methods for an specific country
	 * 	Else: List of Localbitcoins Payment methods
	 */
	getPaymentMethodsList: async (countryCode = null) => {
		let response = null
		let path = UnizendLocalBTC.apiPaths.paymentMethods

		// Adds the country code to de path
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
	 * @param paymentMethod String
	 * 	Valid payment method string
	 * 
	 * @uses localbitcoins.getPaymentMethodsList()
	 * 
	 * @since 1.0.0
	 * 
	 * @returns Object Json | An specific payment method
	 */
	getPaymentMethod: async (paymentMethod) => {
		let response = await UnizendLocalBTC.localbitcoins.getPaymentMethodsList()

		return response[paymentMethod]
	},

	/**
	 * Country Codes list
	 * 
	 * @since 1.0.0
	 * 
	 * @see https://localbitcoins.com/api-docs/#countrycodes
	 * 
	 * @returns Oject Json | List of valid Localbitcoins countries
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
	 * @param currency String @default null
	 * 	Valid currency
	 * 
	 * @see https://localbitcoins.com/api-docs/#currencies
	 * 
	 * @returns Oject Json |
	 * 	If currency: Currency info
	 * 	else: List of Localbitcoins valid currencies
	 */
	getCurrencies: async (currency = null) => {
		let path = UnizendLocalBTC.apiPaths.currencies
		let response = await UnizendLocalBTC.get(path)

		return (currency && response.data.currencies[currency]) ? response.data.currencies[currency] : response.data.currencies
	},

	/**
	 * Get ads from places
	 * 
	 * @param coordinates Object @default {}
	 * 	Required:	lat | Latitude coordinate
	 * 						lan | Longitude coordinate
	 * 	Optional:	countrycode | two length string
	 * 						location_string | Human readable location text
	 * 
	 * @see https://localbitcoins.com/api-docs/#places
	 * 
	 * @since 1.0.0
	 * 
	 * @returns Object Json | List of ads link fron an specific location
	 */
	getPlaces: async (coordinates = {}) => {
		let path = UnizendLocalBTC.apiPaths.places
		let response = await UnizendLocalBTC.get(path, false, coordinates)

		return response
	},

	/**
	 * BTC price from equation
	 * 
	 * @param equationString String
	 * 	A valid equation. See https://localbitcoins.com/guides/equation-howto
	 * 
	 * @see https://localbitcoins.com/api-docs/#equation
	 * 
	 * @since 1.0.0
	 * 
	 * @returns Object json | Result of equations
	 */
	getBTCPriceFromEquation: async (equationString) => {
		let path = UnizendLocalBTC.apiPaths.equation

		let setEquation = equationString => path +`/${equationString}`

		path = setEquation(equationString)

		let response = await UnizendLocalBTC.get(path, false, {}, false)

		return response
	},

	/**
	 * Localbitcoins transactions fees
	 * 
	 * @since 1.0.0
	 * 
	 * @see https://localbitcoins.com/api-docs/#fees
	 * 
	 * @returns The current outgoing and deposit fees in bitcoins (BTC).
	 */
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
	 * @param path String
	 * 	Current path
	 * @param adId Integer
	 * 	The Ad id
	 * 
	 * @since 1.0.0
	 */
	setId: (path, adId) => path + `/${adId}`,

	/**
	 * Gets an ad
	 * 
	 * @param adId Integer
	 * 	Valid ad Id
	 * 
	 * @see https://localbitcoins.com/api-docs/#ads
	 * @see https://localbitcoins.com/api-docs/#ad-get-id
	 * 
	 * TODO Add arguments support
	 * TODO Add /api/ad-get/ endpoint
	 * 
	 * @since 1.0.0
	 * 
	 * @returns Oject Json |
	 * 	If adId: Returns information of single advertisement based on the ad ID
	 * 	Else: The token owner's all advertisements in the data key ad_list
	 */
	get: async (adId = null) => {
		let path = (adId == null) ? UnizendLocalBTC.apiPaths.ads : UnizendLocalBTC.ads.setId(UnizendLocalBTC.apiPaths.adGet, adId)

		let response = await UnizendLocalBTC.get(path)

		return response.data.ad_list
	},

	/**
	 * Update an advertisement
	 * 
	 * @param adId Integer
	 * 	A valid ad id
	 * @param params Oject
	 * 	Required:
	 * 		price_equation								String		Price equation formula
	 * 		lat														Integer		Latitude coordinate
	 * 		lon														Integer		Longitude coordinate
	 * 		city													String		City name
	 * 		location_string								String		Human readable locationtext.
	 * 		countrycode										String		Two-character country code.
	 * 		currency											String		Three letter currency code
	 * 		account_info									String		-
	 * 		bank_name											String		Certain of the online payment 
	 * 																						methods require bank_name to be
	 * 																						chosen from a limited set of
	 * 																						names.
	 * 		msg														String		Terms of trade of the ad
	 * 		sms_verification_required			Boolean		Use True or False.
	 * 		track_max_amount							Boolean		Use True or False.
	 * 		require_trusted_by_advertiser	Boolean		Use True or False.
	 * 		require_identification				Boolean		Use True or False.
	 * 
	 * 	Optional:
	 * 		min_amount										Integer		Minimum transaction limit in fiat
	 * 		max_amount										Integer		Maximum transaction limit in fiat
	 * 		opening_hours									Object		Times when ad is visible
	 * 		visible												Booolean	Use True or False.
	 * 
	 * 	Optional ONLINE_SELL:
	 * 		require_trade_volume					Integer
	 * 		require_feedback_score				Integer
	 * 		first_time_limit_btc					Integer
	 * 		volume_coefficient_btc				Integer
	 * 		reference_type								String		Supported values are
	 * 																						SHORT, LONG, NUMERIC, LETTERS
	 * 		display_reference							Boolean		Show reference in trades opened
	 * 																						using this ad.
	 * 
	 * 	Optional ONLINE_BUY:
	 * 		payment_window_minutes				Integer		Payment window time in minutes
	 * 
	 * 	Optional LOCAL_SELL:
	 * 		floating											Boolean		Enable floating price for the ad
	 * 
	 * @see https://localbitcoins.com/api-docs/#ad-id
	 * 
	 * @since 1.0.0
	 */
	update: async (adId, params) => {
		let path = UnizendLocalBTC.ads.setId(UnizendLocalBTC.apiPaths.adUpdate, adId)

		console.log('Update an advertisement')
		let response = await UnizendLocalBTC.post(path, params)

		return response
	},

	/**
	 * Creates a new advertisement
	 * 
	 * @param params Oject
	 * 	Required:
	 * 		price_equation								String		Price equation formula
	 * 		lat														Integer		Latitude coordinate
	 * 		lon														Integer		Longitude coordinate
	 * 		city													String		City name
	 * 		location_string								String		Human readable locationtext.
	 * 		countrycode										String		Two-character country code.
	 * 		currency											String		Three letter currency code
	 * 		account_info									String		-
	 * 		bank_name											String		Certain of the online payment 
	 * 																						methods require bank_name to be
	 * 																						chosen from a limited set of
	 * 																						names.
	 * 		msg														String		Terms of trade of the ad
	 * 		sms_verification_required			Boolean		Use True or False.
	 * 		track_max_amount							Boolean		Use True or False.
	 * 		require_trusted_by_advertiser	Boolean		Use True or False.
	 * 		require_identification				Boolean		Use True or False.
	 * 
	 * 	Optional:
	 * 		min_amount										Integer		Minimum transaction limit in fiat
	 * 		max_amount										Integer		Maximum transaction limit in fiat
	 * 		opening_hours									Object		Times when ad is visible
	 * 		visible												Booolean	Use True or False.
	 * 
	 * 	Optional ONLINE_SELL:
	 * 		require_trade_volume					Integer
	 * 		require_feedback_score				Integer
	 * 		first_time_limit_btc					Integer
	 * 		volume_coefficient_btc				Integer
	 * 		reference_type								String		Supported values are
	 * 																						SHORT, LONG, NUMERIC, LETTERS
	 * 		display_reference							Boolean		Show reference in trades opened
	 * 																						using this ad.
	 * 
	 * 	Optional ONLINE_BUY:
	 * 		payment_window_minutes				Integer		Payment window time in minutes
	 * 
	 * 	Optional LOCAL_SELL:
	 * 		floating											Boolean		Enable floating price for the ad
	 * 
	 * @see https://localbitcoins.com/api-docs/#ad-create
	 * 
	 * @since 1.0.0
	 */
	create: async (params) => {
		let path = UnizendLocalBTC.apiPaths.adCreate

		console.log('Create a new advertisement')
		let response = await UnizendLocalBTC.post(path, params)

		return response
	},

	/**
	 * Updates the ad price by udating equation
	 * 
	 * @param adId Integer
	 * 	A valid ad id
	 * @param params Object
	 * 	price_equation	String	Price equation formula
	 * 
	 * @see https://localbitcoins.com/api-docs/#ad-equation-id
	 * 
	 * @since 1.0.0
	 */
	updateEquation: async (adId, params) => {
		let path = UnizendLocalBTC.ads.setId(UnizendLocalBTC.apiPaths.adEquation, adId)

		console.log('Update equation of an advertisement')
		let response = await UnizendLocalBTC.post(path, params)

		return response
	},

	/**
	 * Delete an advertisement
	 * 
	 * @param adId Integer
	 * 	A valid ad id
	 * 
	 * @see https://localbitcoins.com/api-docs/#ad-delete
	 * 
	 * @since 1.0.0
	 */
	delete: async (adId) => {
		let path = UnizendLocalBTC.ads.setId(UnizendLocalBTC.apiPaths.adDelete, adId)

		console.log('Remove an advertisement')
		let response = await UnizendLocalBTC.post(path, {})

		return response
	}
}

/**
 * Trades
 * 
 * @since 1.0.0
 */
UnizendLocalBTC.trades = {
	/**
	 * Ads extra data to the path
	 * 
	 * @param path String
	 * 	The current path
	 * @param value String
	 * 	Extra data
	 * 
	 * @since 1.0.0
	 */
	setPath: (path, value) => path + `/${value}`,

	/**
	 * Gives feedback to user.
	 * Possible feedback values are:
	 * 				trust
	 * 				positive
	 * 				neutral
	 * 				block
	 * 				block_without_feedback
	 * 
	 * Required Arguments
	 * 	feedback	String 	Feedback value
	 * 
	 * Optional arguments:
	 * 	msg				String	Feedback message displayed alongside feedback on
	 * 										receivers profile page.
	 * 
	 * @see https://localbitcoins.com/api-docs/#feedback
	 * 
	 * @since 1.0.0
	 * 
	 * TODO Test it to make it work
	 */
	giveFeedbackTo: async (username) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.feedback, username)

		console.log('Gives feedback to a user')

		return path
	},

	/**
	 * Returns informations about a single trade id
	 * 
	 * @see https://localbitcoins.com/api-docs/#contact-info-id
	 * 
	 * TODO Add /api/contact_info/ endpoint
	 * 
	 * @since 1.0.0
	 * 
	 * TODO Test it to make it work
	 */
	info: async (contactId = null) => {
		let base_path = UnizendLocalBTC.apiPaths.contact + 'info'
		let path = (contactId === null) ? base_path : UnizendLocalBTC.trades.setPath(base_path, contactId)

		console.log('Returns informations about a single trade id')

		return path
	},

	/**
	 * Start a trade from an advertisement
	 * 
	 * Required arguments:
	 * 		amount		Integer		Number in the advertisement's fiat currency
	 * 
	 * Optional arguments:
	 * 		message		String		Optional message to send to the advertiser
	 * 
	 * @see https://localbitcoins.com/api-docs/#contact-create
	 * 
	 * @since 1.0.0
	 * 
	 * TODO Test it to make it work
	 */
	create: async (adId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'create', adId)

		console.log('Start a trade from advertisement')

		return path
	},

	/**
	 * If type == identified
	 * 	Marks the identity of trade partner as verified. You must be the advertiser in this trade.
	 * If type == realnema
	 * 	Mark realname confirmation.
	 * 
	 * @see https://localbitcoins.com/api-docs/#contact-mark-identified
	 * @see https://localbitcoins.com/api-docs/#contact-mark-realname
	 * 
	 * @since 1.0.0
	 * 
	 * TODO Test it to make it work
	 */
	verify: async (type, contactId) => {
		let base_path = UnizendLocalBTC.apiPaths.contact + 'mark_' + type
		let path = UnizendLocalBTC.trades.setPath(base_path, contactId)

		return path
	},

	/**
	 * Returns all chat messages from the trade
	 * 
	 * @see https://localbitcoins.com/api-docs/#contact-message
	 * 
	 * @since 1.0.0
	 * 
	 * TODO Test it to make it work
	 */
	getMsgs: async (contactId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'messages', contactId)

		return path
	},

	/**
	 * Posts a message and/or uploads an image to the trade.
	 * Encode images with multipart/form-data encoding.
	 * 
	 * Required arguments one or both:
	 * 	msg				String		Chat message to trade chat.
	 * 	document	File			Image attachments encoded with multipart/form-data
	 * 
	 * @see https://localbitcoins.com/api-docs/#contact-post
	 * 
	 * @since 1.0.0
	 * 
	 * TODO Test it to make it work
	 */
	postMsg: async (contactId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'message_post', contactId)

		return path
	},

	/**
	 * Mark a trade as paid.
	 * 
	 * @see https://localbitcoins.com/api-docs/#contact-paid
	 * 
	 * @since 1.0.0
	 * 
	 * TODO Test it to make it work
	 */
	paid: async (contactId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'mark_as_paid', contactId)

		return path
	},

	/**
	 * Releases Bitcoin trades specified by ID {contact_id}.
	 * If the release was successful a message is returned on the data key.
	 * 
	 * @see https://localbitcoins.com/api-docs/#contact-release
	 * 
	 * @since 1.0.0
	 * 
	 * TODO Test it to make it work
	 */
	releaseBTC: async (contactId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'release', contactId)

		return path
	},

	/**
	 * Cancels the trade if the token owner is the Bitcoin buyer.
	 * Bitcoin sellers cannot cancel trades.
	 * 
	 * @see https://localbitcoins.com/api-docs/#contact-cancel
	 * 
	 * @since 1.0.0
	 * 
	 * TODO Test it to make it work
	 */
	cancel: async (contactId) => {
		let path = UnizendLocalBTC.trades.setPath(UnizendLocalBTC.apiPaths.contact + 'cancel', contactId)

		return path
	},

	/**
	 * Starts a dispute on the specified trade ID if the requirements
	 * for starting the dispute has been fulfilled.
	 * 
	 * @see https://localbitcoins.com/api-docs/#contact-dispute
	 * 
	 * @since 1.0.0
	 * 
	 * TODO Test it to make it work
	 */
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
	 * @param username String
	 * 	The user name
	 * 
	 * @see https://localbitcoins.com/api-docs/#account_info
	 * 
	 * @since 1.0.0
	 * 
	 * @returns Object | 
	 * 		the same information that is found on an account's public profile page
	 */
	getUserInfo: async (username) => {
		let path = UnizendLocalBTC.apiPaths.account_info + `/${username}`
		let response = await UnizendLocalBTC.get(path)

		return response.data
	},

	/**
	 * Gets my user info
	 * 
	 * @see https://localbitcoins.com/api-docs/#myself
	 * 
	 * @since 1.0.0
	 */
	myself: async () => {
		let path = UnizendLocalBTC.apiPaths.myself
		let response = await UnizendLocalBTC.get(path)

		return response.data
	},

	/**
	 * Dashboard methods
	 * 
	 * @since 1.0.0
	 */
	dashboard: {
		/**
		 * Dashboard Info
		 * 
		 * @see https://localbitcoins.com/api-docs/#dashboard
		 * 
		 * @since 1.0.0
		 * 
		 * @returns Object | list of trades on the data key contact_list
		 */
		info: async () => {
			let path = UnizendLocalBTC.apiPaths.dashboard
			let response = await UnizendLocalBTC.get(path)

			return response
		},

		/**
		 * Dashboard released trades
		 * 
		 * @see https://localbitcoins.com/api-docs/#dashboard-released
		 * 
		 * @since 1.0.0
		 * 
		 * @returns Object |
		 * 	a list of all released trades where the token owner is either
		 * 	a buyer or seller. 
		 */
		released: async () => {
			let path = UnizendLocalBTC.apiPaths.dashboard + '/released'
			let response = await UnizendLocalBTC.get(path)

			return response
		},

		/**
		 * Dashboard canceled trades
		 * 
		 * @see https://localbitcoins.com/api-docs/#dashboard-canceled
		 * 
		 * @since 1.0.0
		 * 
		 * @returns Object |
		 * 	a list of all canceled trades where the token owner is either
		 * 	a buyer or seller.
		 */
		canceled: async () => {
			let path = UnizendLocalBTC.apiPaths.dashboard + '/canceled'
			let response = await UnizendLocalBTC.get(path)

			return response
		},

		/**
		 * Dashboard Closed trades
		 * 
		 * @see https://localbitcoins.com/api-docs/#dashboard-closed
		 * 
		 * @since 1.0.0
		 * 
		 * @returns Object |
		 * 	a list of all closed trades where the token owner is either
		 * 	a buyer or seller.
		 */
		closed: async () => {
			let path = UnizendLocalBTC.apiPaths.dashboard + '/closed'
			let response = await UnizendLocalBTC.get(path)

			return response
		}
	},

	/**
	 * Notifications methods
	 * 
	 * @since 1.0.0
	 */
	notifications: {
		/**
		 * Notifications List
		 * 
		 * @see https://localbitcoins.com/api-docs/#notifications
		 * 
		 * @since 1.0.0
		 * 
		 * @returns Object | recent notifications
		 */
		getList: async () => {
			let path = UnizendLocalBTC.apiPaths.notifications
			let response = await UnizendLocalBTC.get(path)

			return response
		},

		/**
		 * Notifications, Mark as read
		 * Marks a specific notification as read
		 * 
		 * @see https://localbitcoins.com/api-docs/#notifications-read
		 * 
		 * @param notificationId String
		 * 	Notification id
		 */
		markAsRead: async (notificationId) => {
			let path = UnizendLocalBTC.apiPaths.notifications + '/mark_as_read/' + notificationId
			let response = await UnizendLocalBTC.post(path, {})
			
			return response
		}
	},

	/**
	 * Recent messages
	 * 
	 * Optional arguments:
	 * 	after		Date		Return messages before date. UTC date in ISO 8601 format
	 * 
	 * @see https://localbitcoins.com/api-docs/#recent-messages
	 * 
	 * @since 1.0.0
	 * 
	 * @returns Object | maximum of 25 newest trade messages
	 */
	getRecentMsgs: async () => {
		let path = UnizendLocalBTC.apiPaths.recentMessages
		let response = await UnizendLocalBTC.get(path)

		return response
	},

	/**
	 * Get list of real name verifiers for the user
	 * 
	 * @see https://localbitcoins.com/api-docs/#real-name-verifiers
	 * 
	 * @param username String
	 * 	Valid user name
	 * 
	 * @since 1.0.0
	 * 
	 * @returns Object |
	 * 		list of real name verifiers for the user.
	 * 		Returns a list only when you have a trade with the user where
	 * 		you are the seller.
	 */
	getRealNameVerifiers: async (username) => {
		let path = UnizendLocalBTC.apiPaths.realNameVerifiers + `/${username}`
		let response = await UnizendLocalBTC.get(path)

		return response
	},

	/**
	 * Checks the given PIN code against the token owners currently active PIN
	 * code.
	 * You can use this method to ensure the person using the session is the
	 * legitimate user.
	 * 
	 * @see https://localbitcoins.com/api-docs/#pin
	 * 
	 * @param pin Integer
	 * 	4 digit app PIN code set from profile settings
	 * 
	 * @since 1.0.0
	 */
	pincode: async (pin) => {
		let path = UnizendLocalBTC.apiPaths.pincode
		let response = await UnizendLocalBTC.post(path, { pincode: pin })

		return response
	},

	/**
	 * Expires the current access token immediately.
	 * To get a new token afterwards, public apps will need to re-authenticate,
	 * confidential apps can turn in a refresh token.
	 * 
	 * @see https://localbitcoins.com/api-docs/#logout
	 * 
	 * @since 1.0.0
	 */
	logout: async () => {
		let path = UnizendLocalBTC.apiPaths.logout
		let response = await UnizendLocalBTC.post(path, {})

		return response
	}
}

/**
 * Wallet
 * 
 * @since 1.0.0
 */
UnizendLocalBTC.wallet = {
	/**
	 * Gets information about the token owner's wallet balance
	 * 
	 * @see https://localbitcoins.com/api-docs/#wallet
	 * 
	 * @since 1.0.0
	 */
	getInfo: async () => {
		let path = UnizendLocalBTC.apiPaths.walletInfo
		let response = await UnizendLocalBTC.get(path)

		return response
	},

	/**
	 * Same as getInfo() above, but only returns the receiving_address
	 * and total fields.
	 * Use this instead if you don't care about transactions at the moment.
	 * 
	 * @see https://localbitcoins.com/api-docs/#wallet-balance
	 * 
	 * @since 1.0.0
	 */
	getBalance: async () => {
		let path = UnizendLocalBTC.apiPaths.walletBalance
		let response = await UnizendLocalBTC.get(path)

		return response
	},

	/**
	 * Sends amount of bitcoins from the token owner's wallet to address.
	 * 
	 * @param params Object
	 * 	Required arguments:
	 * 		address		String		Bitcoin address where you're sending Bitcoin to.
	 * 		amount		Integer		Amount of Bitcoin to send.
	 * 
	 * @see https://localbitcoins.com/api-docs/#wallet-send
	 * 
	 * @since 1.0.0
	 */
	send: async (params) => {
		let path = UnizendLocalBTC.apiPaths.walletSend
		let response = await UnizendLocalBTC.post(path, params)

		return response
	},

	/**
	 * As send(), but needs the token owner's active PIN code to succeed.
	 * 
	 * @param params Object
	 * 	Required arguments:
	 * 		address	String	Bitcoin address where you're sending Bitcoin to.
	 * 		amount	Integer	Amount of Bitcoin to send.
	 * 		pincode	Integer	Token owners PIN code.
	 * 
	 * @see https://localbitcoins.com/api-docs/#wallet-send-pin
	 * 
	 * @since 1.0.0
	 */
	sendPin: async (params) => {
		let path = UnizendLocalBTC.apiPaths.walletSendPin
		let response = await UnizendLocalBTC.post(path, params)

		return response
	},
	
	/**
	 * Unused BTC address
	 * 
	 * @see https://localbitcoins.com/api-docs/#wallet-addr
	 * 
	 * @since 1.0.0
	 * 
	 * @returns Object |
	 * 	an unused receiving address from the token owner's wallet.
	 */
	getAddr: async () => {
		let path = UnizendLocalBTC.apiPaths.walletAddr
		let response = await UnizendLocalBTC.post(path, {})

		return response
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
	 * Posible wndpoints:
	 * /buy-bitcoins-online/.json
	 * /buy-bitcoins-online/${payment_method}/.json
	 * /buy-bitcoins-online/${currency}/.json
	 * /buy-bitcoins-online/${currency}/${payment_method}/.json
	 * /buy-bitcoins-online/${countrycode}/${country_name}/.json
	 * /buy-bitcoins-online/${countrycode}/${country_name}/${payment_method}/.json
	 * /sell-bitcoins-online/.json
	 * /sell-bitcoins-online/${payment_method}/.json
	 * /sell-bitcoins-online/${currency}/.json
	 * /sell-bitcoins-online/${currency}/${payment_method}/.json
	 * /sell-bitcoins-online/${countrycode}/${country_name}/.json
	 * /sell-bitcoins-online/${countrycode}/${country_name}/${payment_method}/.json
	 * 
	 * /buy-bitcoins-with-cash/{location_id}/{location_slug}/.json // TODO
	 * /sell-bitcoins-with-cash/{location_id}/{location_slug}/.json // TODO
	 * 
	 * @param action String
	 * 	buy or sell
	 * @param options Object
	 * 	Posible fields:
	 * 		countryCode 	String		Valid Localbitcoins Countrycode
	 * 		countryName		String		Valid country name for the countrycode
	 * 		paymentMethod	String 		Valid Localbitcoins payment method
	 * 		currency			String		Valid currency code
	 * @param page Object
	 * 	page 	Integer 	Page number
	 * 
	 * @see https://localbitcoins.com/api-docs/#online-buy6
	 * @see https://localbitcoins.com/api-docs/#online-buy5
	 * @see https://localbitcoins.com/api-docs/#online-buy4
	 * @see https://localbitcoins.com/api-docs/#online-buy3
	 * @see https://localbitcoins.com/api-docs/#online-buy2
	 * @see https://localbitcoins.com/api-docs/#online-buy1
	 * 
	 * @see https://localbitcoins.com/api-docs/#online-sell6
	 * @see https://localbitcoins.com/api-docs/#online-sell5
	 * @see https://localbitcoins.com/api-docs/#online-sell4
	 * @see https://localbitcoins.com/api-docs/#online-sell3
	 * @see https://localbitcoins.com/api-docs/#online-sell2
	 * @see https://localbitcoins.com/api-docs/#online-sell1
	 * 
	 * TODO Add support for
	 * @see https://localbitcoins.com/api-docs/#local-buy
	 * @see https://localbitcoins.com/api-docs/#local-sell
	 * 
	 * @since 1.0.0
	 * 
	 * @return Object Json | List of ads
	 */
	adsList: async (action, options = {}, page = {}) => {
		let prefix = action + '-'

		//console.log(options)

		let countryCode = (options.countryCode) ? options.countryCode : false
		let countryName = (options.countryName) ? options.countryName : false
		let paymentMethod = (options.paymentMethod) ? options.paymentMethod : false
		let currency = (options.currency) ? options.currency : false
		
		let basePath = prefix + 'bitcoins-online'
		let suffix = '.json'

		let path

		if (currency) {
			path = (paymentMethod) ? `${basePath}/${currency}/${paymentMethod}/${suffix}` : `${basePath}/${currency}/${suffix}`
		} else if (countryCode && countryName) {
			path = (paymentMethod) ? `${basePath}/${countryCode}/${countryName}/${paymentMethod}/${suffix}` : `${basePath}/${countryCode}/${countryName}/${suffix}`
		} else if (!currency && !countryCode && !countryName) {
			path = (paymentMethod) ? `${basePath}/${paymentMethod}/${suffix}` : `${basePath}/${suffix}`
		}

		// console.log(page)

		let response = await UnizendLocalBTC.get(path, true, page, false)

		// console.log(response.pagination.next)

		return response


	},

	/**
	 * Get BTC Average price
	 * 
	 * @param currency String
	 * 	Filters result by one of the currencies supported
	 * 	by localbitcoins @since 1.0.8
	 * @param time String
	 * 	Gets a specific timing @since 1.0.8
	 * 	Posible values: 1h, 6h, 12h, 24h; where the number is for the
	 * 	hours and the h means hours
	 * 
	 * @see https://localbitcoins.com/api-docs/#ticker-all
	 * 
	 * @since 1.0.0
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
		 * Latest 500 closed trades in online buy and online sell categories,
		 * updated every 15 minutes. You can get older trades by using argument
		 * max_tid.
		 * 
		 * Optional arguments	max_tid
		 * 
		 * @see https://localbitcoins.com/api-docs/#trades
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
		 * Buy and sell bitcoin online advertisements.
		 * Amount is the maximum amount available for the trade request.
		 * Price is the hourly updated price. The price is based on the price
		 * equation and commission % entered by the ad author.
		 * 
		 * @see https://localbitcoins.com/api-docs/#orderbook
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