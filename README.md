# Node Localbitcoins API

NodeJS Client Library for the LocalBitcoins API

## Getting Started

### Clone or download.

By downloading you will get a copy of this repository on your local machine
It is being developed using `node 10.16.3` and `npm 6.9.0`

### Install

Go to the folder and exec `nmp install`

You need to create a `config.json` file in the module root folder, with your localbitcoins account HMAC Auth key and secret.

You can get it [here](https://localbitcoins.com/accounts/api/)
For more information check the [localbitcoins api documentation](https://localbitcoins.com/api-docs/)

It should look like this

	{
	  "auth": {
	    "key": "YOUR_HMAC_AUTH_KEY",
	    "secret": "YOUR_HMAC_AUTH_SECRET"
	  }
	}

### Use

Create a `tests` folder which will contain your test files

Require the `lbtcss-api.js` file

	const lbtcs = require('../lbtcs-api.js')

### Features

#### `lbtcs.get`

Makes an API request using the method 'GET'

##### Params

**`path`:** The path to the api
**`public_api`** Boolean. False by default. If true it will not add the `/api/` folder before the paht because the localbitcoins public api does not need it.

##### Example code

	const lbtcs = require('../lbtcs-api.js')

	// Returns a list of payment methos from Venezuela
	lbtcs.get('payment_methods/ve').then(res => {
		console.log(res)
	})

	// Using the public api to list buying ads in Colombia
	lbtcs.get('buy-bitcoins-online/co/colombia/cash-deposit', true).then(res => {
		console.log(res)
	})

#### `lbtcs.post`

Makes an API request using the method 'POST'

##### Params

**`path`:** The path to the api
**`params`:** Params you will use

##### Example code

	const lbtcs = require('../lbtcs-api.js')

	// Immediately expires the current access token.
	lbtcs.post('logout').then(res => {
		console.log(res)
	})

#### `lbtcs.getAPIPath()`

Returns a list of the paths for api requests

#### `lbtcs.localbitcoins`

Access localbitcoins public data

- `lbtcs.localbitcoins.getPaymentMethodsList(coutrycode)`
- `lbtcs.localbitcoins.getPaymentMethod(payment_method coutrycode)`
- `lbtcs.localbitcoins.getCountrycodes()`
- `lbtcs.localbitcoins.getCurrencies()`
- `lbtcs.localbitcoins.getPlaces()` TODO
- `lbtcs.localbitcoins.getBTCPriceFromEquation(equation_string)`
- `lbtcs.localbitcoins.getFees()`

#### `lbtcs.ads`

Access your localbitcoins ads

- `lbtcs.ads.get(ad_id)`
- `lbtcs.ads.update(ad_id)` TODO
- `lbtcs.ads.updateEquation(ad_id)` TODO
- `lbtcs.ads.create()` TODO
- `lbtcs.ads.remove(ad_id)` TODO

#### `lbtcs.ads`

Access localbitcoins trades

- `lbtcs.trades.giveFeedbackTo(username)` TODO
- `lbtcs.trades.info(contact_id)` TODO
- `lbtcs.trades.create(ad_id)` TODO
- `lbtcs.trades.verify(type, contact_id)` TODO
- `lbtcs.trades.getMsgs(contact_id)` TODO
- `lbtcs.trades.postMsg(contact_id)` TODO
- `lbtcs.trades.paid(contact_id)` TODO
- `lbtcs.trades.releaseBTC(contact_id)` TODO
- `lbtcs.trades.cancel(contact_id)` TODO
- `lbtcs.trades.dispute(contact_id)` TODO

#### `lbtcs.account`

Access your localbitcoins account

- `lbtcs.account.getUserInfo(username)`
- `lbtcs.account.myself()`
- `lbtcs.account.dashbord`
  - `lbtcs.account.dashbord.info()` TODO
  - `lbtcs.account.dashbord.relased()` TODO
  - `lbtcs.account.dashbord.canceled()` TODO
  - `lbtcs.account.dashbord.closed()` TODO
- `lbtcs.account.notifications`
  - `lbtcs.account.notifications.getList()` TODO
  - `lbtcs.account.notifications.markAsRead(notification_id)` TODO
- `lbtcs.account.getRecentMsgs()` TODO
- `lbtcs.account.getRealNameVerifiers()` TODO
- `lbtcs.account.pincode()` TODO
- `lbtcs.account.logout()` TODO

#### `lbtcs.wallet`

Access your localbitcoins wallet

- `lbtcs.wallet.getInfo()` TODO
- `lbtcs.wallet.getBalance()` TODO
- `lbtcs.wallet.send()` TODO
- `lbtcs.wallet.sendPin()` TODO
- `lbtcs.wallet.getAddr()` TODO

#### `lbtcs.public_api`

Access localbitcoins public api

- `lbtcs.public_api.buyOnline(params)`
- `lbtcs.public_api.sellOnline(params)`

## Contributing

- Fork it!
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request