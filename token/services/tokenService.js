const promisifyAll = require('functional-js/promises/promisifyAll')
const Promise = require('bluebird')

const getCert = fs => fs.readFile('./.secret/private.key', 'utf8')

module.exports = (props) => {
    const fs = promisifyAll(props.libs.fs)

    console.log('!!!!!!!!!!!!!', fs)

    return getCert(fs)
}


  // const realm = event.path.realm

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     id_token: jwt.sign({ jwtid: 'jwtid', realm }, cert, settings.jwt.options),
  //     token_type: 'Bearer',
  //     expires_in: settings.jwt.options.expiresIn
  //   })
  // }


// specs: https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest

/*
POST /token HTTP/1.1
  Host: server.example.com
  Content-Type: application/x-www-form-urlencoded
  Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

  grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
*/

// grant_type=password&client_id=curl&username=user&password=password

