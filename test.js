const lbtc = require('./unizend-localbtc')

require('dotenv').config()

lbtc.init(process.env.AUTH_KEY, process.env.AUTH_SECRET)

// 1.0.0
/* const vesPrice = lbtc.publicMarketData.adsList('sell', {
    countryCode: 've',
    countryName: 'venezuela'
}).then(response => {
    console.log(response[1].data.payment_method)
}) */

/* const btcAverage = lbtc.publicMarketData.bitcoinAverage().then(response => {
    console.log(response.VES)
}) */

/* const btcCharts = lbtc.publicMarketData.bitcoinCharts.orderBooks('VES').then(response => {
    console.log(response.bids)
}) */

/* const paymentMethodList = lbtc.localbitcoins.getPaymentMethodsList('VE').then(response => {
    console.log(response)
}) */

/* const paymentMethod = lbtc.localbitcoins.getPaymentMethod('transferwise', 've').then(response => {
    console.log(response)
}) */

/* const countryCodes = lbtc.localbitcoins.getCountryCodes().then(response => {
    console.log(response)
}) */

/* const currencies = lbtc.localbitcoins.getCurrencies().then(response => {
    console.log(response.ETH)
}) */

/* const equation = lbtc.localbitcoins.getBTCPriceFromEquation('btc_in_usd*0.9').then(response => {
    console.log(response)
}) */

/* const ads = lbtc.ads.get().then(response => {
    console.log(response)
}) */

/* const user = lbtc.account.myself().then(response => {
    console.log(response)
}) */

/* const vesPrice = lbtc.publicMarketData.adsList('sell', {
    paymentMethod: 'transferwise'
}).then(response => {
    console.log(response)
}) */

// 1.0.8
/* const btcAverage = lbtc.publicMarketData.bitcoinAverage('VES', '1h').then(response => {
    console.log(response)
}) */

// lbtc.publicMarketData.adsList('sell', {
//     countryCode: 've',
//     countryName: 'venezuela'
// }, 2).then(response => {
//     console.log(response)
// })

// lbtc.publicMarketData.bitcoinAverage()
//     .then(response => {
//         console.log(response)
//     })

// lbtc.publicMarketData.customBTCAvgList({ VES: '1h', COP: '6h', MXN: '12h' })
//     .then(response => {
//         console.log(response)
//     })

// lbtc.localbitcoins.getFees().then(res => {
//     console.log(res)
// })

lbtc.publicMarketData.adsList('sell', {
    countryCode: 've',
    countryName: 'venezuela'
}, { page: 2 }).then(response => {
    console.log(response)
})