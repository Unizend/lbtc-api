# Contributing

Crypto needs adoption and the goal of this tool is to help other developers build faster! If you find any bugs / issues or have suggestions, please consider contributing. It would be greatly appreciated.

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

Please note we have a [code of conduct](CODE-OF-CONDUCT.md), please follow it in all your interactions with the project.

## Questions/Help

Do you need help?

An example will get you help faster than anything else you do. Create an example and submit it as an [issue](https://github.com/Rincorpes/unizend-localbtc/issues) with the label `question`

Yo can also write to santiago@unizend.com and I'll be happy to help you. :-)

## Reporting Bugs/Requesting Features

If you find bugs or want new features, please submit a new [issue](https://github.com/Rincorpes/unizend-localbtc/issues) with a clear description with the label `bug` for bugs, `invalid`, if you think it could be better in other way; or `enhancement` to request new features.

## Pull Request Process

Follow the steps below to make a contribution to this tool:

### 1) Develop first

1. Fork the Project
2. Clone the forked project

         git clone https://github.com/<your-user-name>/unizend-localbtc

3. Set it up

         # Open the dir
         cd unizend-localbtc

         # Create a branch to work with
         git checkout -b <your-awesome-solution-name>

         # Install all dependencies
         npm install

4. Set env vars

         # Creat your .env file
         touch .env

         # If you are using cmd on windows use the following
         type nul > .env

         # Open the file with your favorite text editor and add the following

         # Localbitcoins API HMAC Auth Key and Secret
         AUTH_KEY=<your-localbitcoins-api-hmac-auth-key>
         AUTH_SECRET=<your-localbitcoins-api-hmac-auth-secret>

See the [.env example file](.env.example)

To get your HMAC Auth key and secret go to your [LocalBitcoins app dashboard](https://localbitcoins.com/accounts/api/)

5. Start coding


### 2) If you consider the following:

* You have added some new featuree with which you add value so that more people reuse this library,
* You have made the tool more versatile to be compatible with new updates,
* You have fixed an existing issue,
* Or you have simply improved the user interface or its documentation
 
Then we encourage you to return the progress made to the repository.

### 3) Submit your update
         
1. Update the CHANGELOG.md with details of changes to the interface, this includes new environment 
   variables, exposed ports, useful file locations and container parameters.
      - Add after `## [Unreleased]`
      ```
         ## [version using SemVer] - year-month-day
         ### Fixed|Changed|Added|Deprecated|Removed
            * <Your change message> By [@username](https://github.com/username)
      ```
2. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
3. commit your changes

         git add .
         git commit -m "<your-awesome-message>"

         git push -u origin <your-awesome-solution-name>

4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.

If you have not contributed to this repo, but thhe tool has been useful for you, we would love to read your experience. Tell us about it openiing an issue or throug admin@unizend.com

## Code of Conduct

Remember this project has a [code of conduct](CODE-OF-CONDUCT.md). We hope everyone taking part of this project, agree with our code of conduct. Read it to know what we exxpect from the contributors.