# Multi-Tenant Serverless Open ID Connect Provider
[![travis-ci build image](https://travis-ci.org/joelnet/serverless-authentication.svg?branch=master)](https://travis-ci.org/joelnet/serverless-authentication) [![Coverage Status](https://coveralls.io/repos/github/joelnet/serverless-authentication/badge.svg?branch=master)](https://coveralls.io/github/joelnet/serverless-authentication?branch=master) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/joelnet/serverless-authentication/master/LICENSE) 

Multi-Tenant Open ID Connect Provider using AWS Serverless Lambdas.

## Project Status

This project is under active development and incomplete. It is not ready for production.

## Installation and Deployment

```bash
# Install serverless globally
npm install serverless -g

# Install dependencies
npm install

# Generate RSA Keys
npm run secrets:generate

# Deploy to dev environment
npm deploy:dev
```
