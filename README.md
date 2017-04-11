# Serverless Open ID Connect Provider  ![travis-ci build image](https://travis-ci.org/joelnet/serverless-authentication.svg?branch=master) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/joelnet/serverless-authentication/master/LICENSE)

based on specs from https://openid.net/specs/openid-connect-core-1_0.html

## Generate RSA Keys

The RSA Keys are used to sign the JWT tokens.

```
npm run secret:generate
```

This will generate a public and private key stored in `.secret`.

This file should not be checked into source control.
