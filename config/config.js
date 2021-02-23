  
const fs = require('fs')
const db = require('../infrastructure/tables').connection()

const twitchSettings = JSON.parse(fs.readFileSync('config/application.json'))

let clientOAuth


module.exports = {
	clientOAuth: token => {
		if(!clientOAuth)
			clientOAuth = token
		return clientOAuth
	},

	twitchSettings: () => {
		return twitchSettings.twitch
	},

	defaultErr: err => {
		console.log(err)
		db.close()
		process.exit(1) 
	}
}