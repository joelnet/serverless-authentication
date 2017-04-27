Cookies?

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