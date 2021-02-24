const https = require('https')
const config = require('../config/settings')

const clientId = config.twitchSettings().clientId

module.exports = {
	createClientToken: () => {
		return new Promise((resolve, reject) => {
			const reqData = JSON.stringify({
				client_id: clientId,
				client_secret: process.env.TROLL_FILTER_SECRET_TWITCH,
				grant_type: 'client_credentials'
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
					resolve(JSON.parse(rawData).access_token)

				})
			})
			
			req.on('error', err => {
				reject(err)
			})
			
			req.write(reqData)
			req.end()
		})

	},

}