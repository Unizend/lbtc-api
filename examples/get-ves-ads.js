// Require lbtcs-api
const lbtcs = require('../lbtcs-api.js')

// Gets BTC selling price for VES
// `action: 'selling'` So we ensure getting selling price
// `countrycode: 've'` Venezuelan countrycode. Param needed to make the api call
// `country_name: 'venezuela'` Param needed to make the api call
// `currency: 'VES'` Some countrys uses diferent currencies, with this param we
// ensure getting only a VES price
// `min_amount: '100000'` Filter minimal amount. This can be any amount you want
const ves_price = lbtcs.public_api.adsList('selling', 've', 'venezuela').then(response => {
	console.log(response[1].data.profile)
})