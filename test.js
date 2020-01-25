const uzLBTCsClient = require('./uz-lbtc')

require('dotenv').config()

uzLBTCsClient.init(process.env.AUTH_KEY, process.env.AUTH_SECRET)

/*const vesPrice = uzLBTCsClient.publicMarketData.adsList('sell', {
    countryCode: 've',
    countryName: 'venezuela'
}).then(response => {
    console.log(response[1].data.payment_method)
})*/

/*const btcAverage = uzLBTCsClient.publicMarketData.bitcoinAverage().then(response => {
    console.log(response.VES)
})*/

/*const btcCharts = uzLBTCsClient.publicMarketData.bitcoinCharts.orderBooks('VES').then(response => {
    console.log(response.bids)
})*/

/*const paymentMethodList = uzLBTCsClient.localbitcoins.getPaymentMethodsList('VE').then(response => {
    console.log(response)
})*/

/*const paymentMethod = uzLBTCsClient.localbitcoins.getPaymentMethod('transferwise', 've').then(response => {
    console.log(response)
})*/

/*const countryCodes = uzLBTCsClient.localbitcoins.getCountryCodes().then(response => {
    console.log(response)
})*/

/*const currencies = uzLBTCsClient.localbitcoins.getCurrencies().then(response => {
    console.log(response.ETH)
})*/

/*const equation = uzLBTCsClient.localbitcoins.getBTCPriceFromEquation('btc_in_usd*0.9').then(response => {
    console.log(response)
})*/

/*const ads = uzLBTCsClient.ads.get().then(response => {
    console.log(response)
})*/

const user = uzLBTCsClient.account.myself().then(response => {
    console.log(response)
})