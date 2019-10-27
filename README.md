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
			"key": "YOUR_HMACK_AUTH_KEY",
			"secret": "YOUR_HMAC_AUTH_SECRET"
		}
	}


## Contributing

- Fork it!
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request