
const config = require('../config/settings')
const viewerRequest = require('../requests/viewer')
const dbTables = require('../infrastructure/tables')
const discordOauth = require('../requests/viewer').OAuthURLDiscord

module.exports = app => {
	app.get('/registerViewerOAuth/Twitch', (req, res) => { 
		if(req.query.state != config.clientOAuth()) {
			return
		}

		viewerRequest.createTwitchToken(req.query.code)
			.then(userTwitchOAuth => {

				console.log(userTwitchOAuth)

				viewerRequest.validateTwitchToken(userTwitchOAuth.access_token).then(userTwitchInfo => {               

					console.log(userTwitchInfo)

					dbTables.insertIntoTwitchViewer(userTwitchOAuth, userTwitchInfo)

					res.redirect(discordOauth + userTwitchInfo.user_id)

				}).catch(config.defaultErr)
			}).catch(config.defaultErr)
	})

	app.get('/registerViewerOAuth/Discord', (req, res) => {
		const twitch_id = req.query.state

		viewerRequest.createDiscordToken(req.query.code)
			.then(userDiscordOAuth => {

				viewerRequest.getDiscordInfo(userDiscordOAuth.access_token)[0].then(userDiscord => {
					viewerRequest.getDiscordInfo(userDiscordOAuth.access_token)[1].then(guilds => {
						console.log(userDiscordOAuth)
						console.log(userDiscord)
						console.log(guilds)

						dbTables.insertIntoDiscordViewer(userDiscordOAuth, userDiscord, twitch_id).then(() => {
							res.send('Ok!')
						})

					}).catch(config.defaultErr)
				}).catch(config.defaultErr)
			}).catch(config.defaultErr)
	})
}