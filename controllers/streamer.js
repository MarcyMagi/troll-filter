
const config = require('../config/settings')
const twitchRequest = require('../requests/streamer')
const dbTables = require('../infrastructure/tables')

module.exports = app => {
	app.get('/registerStreamerOAuth', (req, res) => {
		if(req.query.state != config.clientOAuth()) {
			return
		}

		twitchRequest.createToken(req.query.code)
			.then(streamerOAuth => {

				console.log(streamerOAuth)

				twitchRequest.validateToken(streamerOAuth.access_token).then(streamerInfo => {               
            
					console.log(streamerInfo)

					dbTables.insertIntoStreamer(streamerOAuth, streamerInfo)

					dbTables.selectFromStreamer(streamerInfo.user_id)
						.then(user => {
							console.log(user)
							if(user)
								res.send('Ok!')
							else
								res.send('Rip')
						}).catch(err => config.defaultErr(err))

				}).catch(err => config.defaultErr(err))
			}).catch(err => config.defaultErr(err))
	})

	app.get('/registerUser')

}