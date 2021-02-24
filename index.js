const twitchClient = require('./requests/client')
const twitchStreamer = require('./requests/streamer')
const twitchViewer = require('./requests/viewer')
const server = require('./server')
const twitchTokens = require('./config/settings')

twitchClient.createClientToken().then(token => {

	console.log(
		'Streamer OAuth: ' + twitchStreamer.OAuthURL + token + '\n\n' +
		'Viewer OAuth Twitch: ' + twitchViewer.OAuthURLTwitch + token + '\n\n' +
		'Viewer OAuth Discord: ' + twitchViewer.OAuthURLDiscord + '\n---\n\n')
	twitchTokens.clientOAuth(token)
	server.init()

})