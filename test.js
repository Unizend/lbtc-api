const uzLBTCsApi = require('./unizend-localbtc')

require('dotenv').config()

uzLBTCsApi.init(process.env.AUTH_KEY, process.env.AUTH_SECRET)

// 1.0.0
/* const vesPrice = uzLBTCsApi.publicMarketData.adsList('sell', {
    countryCode: 've',
    countryName: 'venezuela'
}).then(response => {
    console.log(response[1].data.payment_method)
}) */

/* const btcAverage = uzLBTCsApi.publicMarketData.bitcoinAverage().then(response => {
    console.log(response.VES)
}) */

/* const btcCharts = uzLBTCsApi.publicMarketData.bitcoinCharts.orderBooks('VES').then(response => {
    console.log(response.bids)
}) */

/* const paymentMethodList = uzLBTCsApi.localbitcoins.getPaymentMethodsList('VE').then(response => {
    console.log(response)
}) */

/* const paymentMethod = uzLBTCsApi.localbitcoins.getPaymentMethod('transferwise', 've').then(response => {
    console.log(response)
}) */

/* const countryCodes = uzLBTCsApi.localbitcoins.getCountryCodes().then(response => {
    console.log(response)
}) */

/* const currencies = uzLBTCsApi.localbitcoins.getCurrencies().then(response => {
    console.log(response.ETH)
}) */

/* const equation = uzLBTCsApi.localbitcoins.getBTCPriceFromEquation('btc_in_usd*0.9').then(response => {
    console.log(response)
}) */

/* const ads = uzLBTCsApi.ads.get().then(response => {
    console.log(response)
}) */

/* const user = uzLBTCsApi.account.myself().then(response => {
    console.log(response)
}) */

/* const vesPrice = uzLBTCsApi.publicMarketData.adsList('sell', {
    paymentMethod: 'transferwise'
}).then(response => {
    console.log(response)
}) */

// 1.0.8
/* const btcAverage = uzLBTCsApi.publicMarketData.bitcoinAverage('VES', '1h').then(response => {
    console.log(response)
}) */

// uzLBTCsApi.publicMarketData.adsList('sell', {
//     countryCode: 've',
//     countryName: 'venezuela'
// }, 2).then(response => {
//     console.log(response)
// })

uzLBTCsApi.publicMarketData.bitcoinAverage('VES')
    .then(response => {
        console.log(response)
    })

// uzLBTCsApi.publicMarketData.adsList('sell', { countrycode: 've', countryName: 'venezuela' }).then(response => {
//     console.log(response)
// })