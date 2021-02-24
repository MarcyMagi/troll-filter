  
const fs = require('fs')


const settings = JSON.parse(fs.readFileSync('config/application.json'))

let clientOAuth


module.exports = {
	clientOAuth: token => {
		if(!clientOAuth)
			clientOAuth = token
		return clientOAuth
	},

	twitchSettings: () => {
		return settings.twitch
	},

	discordSettings: () => {
		return settings.discord
	},

	defaultErr: err => {
		const db = require('../infrastructure/tables').connection()
		console.log(err)
		db.close()
		process.exit(1) 
	}
}