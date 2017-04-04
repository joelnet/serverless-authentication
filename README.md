# Serverless Open ID Connect Provider

based on specs from https://openid.net/specs/openid-connect-core-1_0.html

## Generate RSA Keys

The RSA Keys are used to sign the JWT tokens.

```
npm run secret:generate
```

This will generate a public and private key stored in `.secret`.

This file should not be checked into source control.
