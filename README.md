# Serverless Open ID Connect Provider  [![travis-ci build image](https://travis-ci.org/joelnet/serverless-authentication.svg?branch=master)](https://travis-ci.org/joelnet/serverless-authentication) [![Coverage Status](https://coveralls.io/repos/github/joelnet/serverless-authentication/badge.svg?branch=master)](https://coveralls.io/github/joelnet/serverless-authentication?branch=master) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/joelnet/serverless-authentication/master/LICENSE) 

Open ID Connect Provider using Serverless Lambdas.

based on specs from https://openid.net/specs/openid-connect-core-1_0.html

## Generate RSA Keys

The RSA Keys are used to sign the JWT tokens.

```
npm run secret:generate
```

This will generate a public and private key stored in `.secret`.

This file should not be checked into source control.

```javascript

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie

//  Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly

// https://aws.amazon.com/blogs/compute/simply-serverless-using-aws-lambda-to-expose-custom-cookies-with-api-gateway/

'use strict';
exports.handler = function(event, context) {
  console.log("{'Cookie':event['Cookie']}");
  var date = new Date();

  // Get Unix milliseconds at current time plus 365 days
  date.setTime(+ date + (365 \* 86400000)); //24 \* 60 \* 60 \* 100
  var cookieVal = Math.random().toString(36).substring(7); // Generate a random cookie string
  
  var cookieString = "myCookie="+cookieVal+"; domain=my.domain; expires="+date.toGMTString()+";";
  
  context.done(null, {"Cookie": cookieString}); 

};

```