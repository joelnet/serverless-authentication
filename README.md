# Serverless Open ID Connect Provider  [![travis-ci build image](https://travis-ci.org/joelnet/serverless-authentication.svg?branch=master)](https://travis-ci.org/joelnet/serverless-authentication) [![Coverage Status](https://coveralls.io/repos/github/joelnet/serverless-authentication/badge.svg?branch=master)](https://coveralls.io/github/joelnet/serverless-authentication?branch=master) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/joelnet/serverless-authentication/master/LICENSE) 

Open ID Connect Provider using Serverless Lambdas.

## Project Status

This project is under active development and incomplete. It is not ready for production.

## Generate RSA Keys

The RSA Keys are used to sign the JWT tokens.

```
npm run secret:generate
```

This will generate a public and private key stored in `.secret`.

This file should not be checked into source control.
