const https = require('https')
const config = require('../config/settings')
const querystring = require('querystring')

const userOAuthSettings = config.twitchSettings().userOAuth
const clientIdTwitch = config.twitchSettings().clientId
const clientIdDiscord = config.discordSettings().clientId

module.exports = { 

	createTwitchToken: code => {
		return new Promise((resolve, reject) => {
			const reqData = JSON.stringify({
				client_id: clientIdTwitch,
				client_secret: process.env.TROLL_FILTER_SECRET_TWITCH,
				code: code,
				grant_type: 'authorization_code',
				redirect_uri: userOAuthSettings.redirect
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

	validateTwitchToken: token => {
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

	createDiscordToken: code => {
		return new Promise((resolve, reject) => {
			const reqData = querystring.stringify({
				client_id: clientIdDiscord,
				client_secret: process.env.TROLL_FILTER_SECRET_DISCORD,
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: config.discordSettings().redirect, 
				scope: config.discordSettings().scope.join(' ')
			})

			const reqOptions = {
				hostname: 'discord.com',
				port: 443,
				path: '/api/oauth2/token',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
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

	getDiscordInfo: token => {
		return [new Promise((resolve, reject) => {
			const reqOptions = {
				hostname: 'discord.com',
				port: 443,
				path: '/api/users/@me',
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: 'Bearer ' + token
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

		}), new Promise((resolve, reject) => { 
			const reqOptions = {
				hostname: 'discord.com',
				port: 443,
				path: '/api/users/@me/guilds',
				method: 'GET',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: 'Bearer ' + token
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

		})]
	},

	OAuthURLTwitch:
		'https://id.twitch.tv/oauth2/authorize' + 
		'?client_id=' + clientIdTwitch +
		'&redirect_uri=' + userOAuthSettings.redirect +
		'&response_type=code' + 
		'&scope=' + userOAuthSettings.scope.join('%20') +
		'&force_verify=true&state=',

	OAuthURLDiscord: 
		'https://discord.com/api/oauth2/authorize' + 
		'?client_id=' + clientIdDiscord +
		'&redirect_uri=' + config.discordSettings().redirect +
		'&response_type=code' + 
		'&scope=' + config.discordSettings().scope.join('%20') +
		'&force_verify=true&state='
}