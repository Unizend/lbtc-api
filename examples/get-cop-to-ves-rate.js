// Require lbtcs-api
const lbtcs = require('../lbtcs-api.js')

/**
 * getCopToVesRate(base, cop, ves, earnings = null)
 * COP to VES low volume FIAT exchanging rate with and without earnings using node-localbitcoins-api
 *
 * @parm base int Base price to calc
 * @parm cop int Buying BTC with COP price
 * @parm ves int Selling BTC for VES price
 * @param earning null default | int earning percentage
 * @return total int COP to VES FIAT exchanging rate
 */
const getCopToVesRate = (base, cop, ves, earnings = null) => {
	// Base COP amount to BTC
	let btc = lbtcs.public_api.calcBTCAmount(base, cop)
	let total_ves, with_earnings

	// If earnings passed
	if (earnings != null) {
		// Multiplies the btc and earnings porcentage to get
		// the earnings amount
		with_earnings = btc * earnings
		// Sets 8 decimals
		with_earnings = with_earnings.toFixed(8)
		// Gets total VES substracting the earnings
		total_ves = total_ves = lbtcs.public_api.calcFIATAmount((btc - with_earnings), ves)
	} else {
		// Else, gets total VES with no earnings
		total_ves = lbtcs.public_api.calcFIATAmount(btc, ves)
	}

	// Divides the base amount with the total VES getted
	let total = base / total_ves

	return total.toFixed(3)
}

// Gets BTC buying price with COP
// `action: 'buying'` So we ensure getting buying price
// `countrycode: 'co'` Colombian countrycode. Param needed to make the api call
// `country_name: 'colombia'` Param needed to make the api call
// `payment_method: 'cash-deposit'` Param needed to make the api call
// `min_amount: '100000'` Filter minimal amount. This can be any amount you want
const cop_price = lbtcs.public_api.getPrice({
	action: 'buying',
	countrycode: 'co',
	country_name: 'colombia',
	payment_method: 'cash-deposit',
	min_amount: 100000
})

// Gets BTC selling price for VES
// `action: 'selling'` So we ensure getting selling price
// `countrycode: 've'` Venezuelan countrycode. Param needed to make the api call
// `country_name: 'venezuela'` Param needed to make the api call
// `currency: 'VES'` Some countrys uses diferent currencies, with this param we
// ensure getting only a VES price
// `min_amount: '100000'` Filter minimal amount. This can be any amount you want
const ves_price = lbtcs.public_api.getPrice({
	action: 'selling',
	countrycode: 've',
	country_name: 'venezuela',
	currency: 'VES',
	min_amount: 100000
})

// This function will display prices on the shell
const displayPrices = async () => {
	// Makes api call to get buying BTC with COP price
	let cop = await cop_price
	// Makes api call to get selling BTC for VES price
	let ves = await ves_price

	// Calcs total BTC amount from a specific FIAT amount
	let cop_to_btc =  lbtcs.public_api.calcBTCAmount(100000, parseInt(cop))
	// Calcs total FIAT amount from passed BTC amount
	let btc_to_ves = lbtcs.public_api.calcFIATAmount(cop_to_btc, parseInt(ves))

	// Cals rate without earnings
	let rate = getCopToVesRate(100000, cop, ves)
	// Calcs rate with 5% earnings
	let rate_with_earnings = getCopToVesRate(100000, cop, ves, 0.05)

	// Display results on shell
	console.log(`BTC buying price with COP is ${cop}`)
	console.log(`BTC selling price with VES is ${ves}`)
	console.log('100,000 COP is ' +cop_to_btc + ' BTC')
	console.log(cop_to_btc + ' is ' + btc_to_ves + ' VES')
	console.log('COP to VES rate without earnings is ' + rate)
	console.log('COP to VES rate with earnings is ' + rate_with_earnings)
}

// Calls displayPrices()
displayPrices()