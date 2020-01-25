# uz-localbitcoins-api

Unizend's Node.js Client Library for the LocalBitcoins API

## Getting Started

Unizend's Node.js Localbitcoins API Client Library has been build to help you access to the localbitcoins API from your Node.js project.

It provides a series of methods that hopefully will ease your development with the Localbitcoins API with Node.js.

### Clone or download.

By downloading you will get a copy of this repository on your local machine
It is being developed using `node 10.16.3` and `npm 6.9.0`

### Install

Go to the folder and exec `nmp install`

All you will need is your HMAC Auth key and secret wich you can get from [here](https://localbitcoins.com/accounts/api/)

For more information check the [Localbitcoins API Documentation](https://localbitcoins.com/api-docs/)

### Use

Require the library:

    const uzLBTCsApi = require('./uz-localbitcoins-api')

Call the `init()` method:

    uzLBTCsApi.init(YOUR_HMAC_AUTH_KEY, YOUR_HMAC_AUTH_SECRET)

### Features

TODO

## Contributing

- Fork it!
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request