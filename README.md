[![Contributors][contributors-shield]][contributors-url] [![Forks][forks-shield]][forks-url] [![Stargazers][stars-shield]][stars-url] [![Issues][issues-shield]][issues-url] [![MIT License][license-shield]][license-url] [![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/rincorpes/unizend-localbtc">
    <img src="http://unizend.com/img/unizend-logo.svg" alt="Logo" width="200" height="80">
  </a>

  <h3 align="center">Unizend's Node.js Client Library for the LocalBitcoins API</h3>

  <p align="center">
    Unizend's Node.js Localbitcoins API Client Library has been build to help you access to the localbitcoins API from your Node.js project.
    <br>
    It provides a series of methods that hopefully will ease your development with the Localbitcoins API using Node.js.
    <br />
    <a href="https://github.com/rincorpes/unizend-localbtc"><strong>Explore the docs »</strong></a>
    <br />
    ·
    <a href="https://github.com/rincorpes/unizend-localbtc/issues">unizend-localbtcrt Bug</a>
    ·
    <a href="https://github.com/rincorpes/unizend-localbtc/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

<!-- ABOUT THE PROJECT -->
## About The Project

[![Unizend's Localbitcoins API][product-screenshot]](https://example.com)

### Built With

* [Dotenv](https://www.npmjs.com/package/dotenv)
* [Node-fetch](https://www.npmjs.com/package/node-fetch)
* [querystring](https://www.npmjs.com/package/querystring)
* [request](https://www.npmjs.com/package/request)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Installation
 
Go to yourn project folder and exec  the following command

    npm i unizend-localbtc

Then install all dependencies

    npm install

<!-- USAGE EXAMPLES -->
## Usage

All you will need is your HMAC Auth key and secret wich you can get from [here](https://localbitcoins.com/accounts/api/)

For more information check the [Localbitcoins API Documentation](https://localbitcoins.com/api-docs/)

**Require the library:**

    const uzLBTCsApi = require('./uz-localbitcoins-api')

**Call the `init()` method:**

    uzLBTCsApi.init(YOUR_HMAC_AUTH_KEY, YOUR_HMAC_AUTH_SECRET)

<!-- ROADMAP -->
## Roadmap

We are working on adding more features to the API. Follow the repo to keep up with our updates.

Feel free to propose features [open issues](https://github.com/rincorpes/unizend-localbtc/issues) and also add or see known issues.

<!-- CONTRIBUTING -->
## Contributing

Crypto needs adoption and the goal of this tool is to help other developers build faster! If you find any bugs / issues or have suggestions, please consider collaborating. **It would be greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Santiago Rincon - [@unizend_pay](https://twitter.com/unizend_pay) - admin@unizend.com

Project Link: [https://github.com/rincorpes/unizend-localbtc](https://github.com/rincorpes/unizend-localbtc)

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [Unizend](https://unizend.com/)
* [Localbitcoins](https://localbitcoins.com/)
* [Othneil Drew](https://github.com/othneildrew)'s [Best README Template](https://github.com/othneildrew/Best-README-Template)
* [Surjith S M](https://github.com/surjithctly)'s [Documentation HTML template](https://github.com/surjithctly/documentation-html-template)



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=flat-square
[contributors-url]: https://github.com/Rincorpes/unizend-localbtc/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=flat-square
[forks-url]: https://github.com/Rincorpes/unizend-localbtc/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=flat-square
[stars-url]: https://github.com/Rincorpes/unizend-localbtc/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=flat-square
[issues-url]: https://github.com/Rincorpes/unizend-localbtc/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/Rincorpes/unizend-localbtc/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/rincorpes/
<!-- [product-screenshot]: images/screenshot.png -->