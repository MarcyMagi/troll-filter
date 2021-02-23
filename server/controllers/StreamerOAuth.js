
const config = require('../../config/config')
const twitchRequest = require('../../twitch/requests')
const dbTables = require('../infrastructure/tables')

module.exports = app => {
    app.get('/registerStreamerOAuth', (req, res) => {
        if(req.query.state != config.clientOAuth()) {
            return
        }

        twitchRequest.createStreamerToken(req.query.code)
        .then(streamerOAuth => {

            console.log(streamerOAuth)

            twitchRequest.validateToken(streamerOAuth.access_token).then(streamerInfo => {               
            
                console.log(streamerInfo)

                dbTables.insertIntoStreamer(streamerOAuth, streamerInfo)

                dbTables.selectFromStreamer(streamerInfo.user_id)
                .then(user => {
                    console.log(user)
                    res.send('Ok!')
                })

            }).catch(config.defaultErr)
        }).catch(config.defaultErr)
    })

}