const uzLBTCsApi = require('./unizend-localbtc')

require('dotenv').config()

uzLBTCsApi.init(process.env.AUTH_KEY, process.env.AUTH_SECRET)

/*const vesPrice = uzLBTCsApi.publicMarketData.adsList('sell', {
    countryCode: 've',
    countryName: 'venezuela'
}).then(response => {
    console.log(response[1].data.payment_method)
})*/

/*const btcAverage = uzLBTCsApi.publicMarketData.bitcoinAverage().then(response => {
    console.log(response.VES)
})*/

/*const btcCharts = uzLBTCsApi.publicMarketData.bitcoinCharts.orderBooks('VES').then(response => {
    console.log(response.bids)
})*/

/*const paymentMethodList = uzLBTCsApi.localbitcoins.getPaymentMethodsList('VE').then(response => {
    console.log(response)
})*/

/*const paymentMethod = uzLBTCsApi.localbitcoins.getPaymentMethod('transferwise', 've').then(response => {
    console.log(response)
})*/

/*const countryCodes = uzLBTCsApi.localbitcoins.getCountryCodes().then(response => {
    console.log(response)
})*/

/*const currencies = uzLBTCsApi.localbitcoins.getCurrencies().then(response => {
    console.log(response.ETH)
})*/

/*const equation = uzLBTCsApi.localbitcoins.getBTCPriceFromEquation('btc_in_usd*0.9').then(response => {
    console.log(response)
})*/

/*const ads = uzLBTCsApi.ads.get().then(response => {
    console.log(response)
})*/

const user = uzLBTCsApi.account.myself().then(response => {
    console.log(response)
})