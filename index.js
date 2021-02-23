const twitchReq = require('./twitch/requests')
const server = require('./server/server')
const twitchTokens = require('./config/config')

twitchReq.createClientToken().then(res => {

    twitchTokens.clientOAuth(res.token)
    server.init()

    console.log(`\n\n${res.OAuthURL}\n`)
})