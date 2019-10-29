# Node Localbitcoins API

NodeJS Client Library for the LocalBitcoins API

## Getting Started

### Clone or download.

By downloading you will get a copy of this repository on your local machine
It is being developed using `node 10.16.3` and `npm 6.9.0`

### Install

Go to the folder and exec `nmp install`

You need to create a `config.json` file in the root folder, with your localbitcoins account HMAC Auth key and secret.

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

##### Example code

	const lbtcs = require('../lbtcs-api.js')

	// Gets a list of payment methos from Venezuela
	lbtcs.get('payment_methods/ve').then(res => {
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

#### `lbtcs.payment_methods.getList()`

Returns a list of valid payment methods. You can also call for payment methods from an specific country

##### Params

**`countrycode`:** Optional. Valid localbitcoins country code to display payment methods for the specified country

##### Example code

	const lbtcs = require('../lbtcs-api.js')

	// Valid payment methods for Colombia
	lbtcs.payment_methods.getList('co').then(res => {
		console.log(res)
	})

## Contributing

- Fork it!
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request