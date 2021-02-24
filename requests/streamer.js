const https = require('https')
const config = require('../config/settings')

const streamerOAuthSettings = config.twitchSettings().streamerOAuth
const clientId = config.twitchSettings().clientId

module.exports = {

	createToken: code => {
		return new Promise((resolve, reject) => {
			const reqData = JSON.stringify({
				client_id: '7ut0fk3wl2mgi8egrnq5yhy4fkmebh',
				client_secret: process.env.TROLL_FILTER_SECRET_TWITCH,
				code: code,
				grant_type: 'authorization_code',
				redirect_uri: streamerOAuthSettings.redirect
			})

			const reqOptions = {
				hostname: 'id.twitch.tv',
				port: 443,
				path: '/oauth2/token',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': reqData.length
				}
			}

			let rawData = ''

			const req = https.request(reqOptions, res => {
				res.on('data', data => {
					rawData += data
				})

				res.on('end', () => {
					resolve(JSON.parse(rawData))
				})
			})

			req.on('error', err => {
				reject(err)
			})
			
			req.write(reqData)
			req.end()

		})

	},

	validateToken: token => {
		return new Promise((resolve, reject) => {

			const reqOptions = {
				hostname: 'id.twitch.tv',
				port: 443,
				path: '/oauth2/validate',
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'OAuth ' + token
				}
			}

			let rawData = ''

			const req = https.request(reqOptions, res => {
				res.on('data', data => {
					rawData += data
				})

				res.on('end', () => {
					resolve(JSON.parse(rawData))
				})
			})

			req.on('error', err => {
				reject(err)
			})
			
			req.end()

		})

	},

	OAuthURL:
		'https://id.twitch.tv/oauth2/authorize' + 
		'?client_id=' + clientId +
		'&redirect_uri=' + streamerOAuthSettings.redirect +
		'&response_type=code' + 
		'&scope=' + streamerOAuthSettings.scope.join('%20') +
		'&force_verify=true&state='

}