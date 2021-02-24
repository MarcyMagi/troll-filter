const createTablesArr = [
	`CREATE TABLE IF NOT EXISTS streamUser (
		twitch_id int PRIMARY KEY,
		access_token nvarchar(255) UNIQUE NOT NULL,
		refresh_token nvarchar(255) UNIQUE NOT NULL
	);`,
	

	`CREATE TABLE IF NOT EXISTS viewerTwitchUser (
		twitch_id int PRIMARY KEY,
		discord_id int UNIQUE,
		twitch_name nvarchar(255) NOT NULL,
		twitch_access_token nvarchar(255) UNIQUE NOT NULL,
		twitch_refresh_token nvarchar(255) UNIQUE NOT NULL,
		FOREIGN KEY (discord_id) REFERENCES viewerDiscordUser (discord_id)
	);`,

	`CREATE TABLE IF NOT EXISTS viewerDiscordUser (
		discord_id int PRIMARY KEY,
		twitch_id int UNIQUE NOT NULL,
		discord_access_token nvarchar(255) UNIQUE NOT NULL,
		discord_refresh_token nvarchar(255) UNIQUE NOT NULL,
		email nvarchar(255) NOT NULL,
		username nvarchar(255) NOT NULL,
		icon nvarchar(255) NOT NULL,

		FOREIGN KEY (twitch_id) REFERENCES viewerTwitchUser (twitch_id)
	);`,		
	
	`CREATE TABLE IF NOT EXISTS streamerViewerRel (
		stream_id int NOT NULL,
		viewer_id int NOT NULL,
		relation int NOT NULL,
		FOREIGN KEY (stream_id) REFERENCES streamUser (twitch_id),
		FOREIGN KEY (viewer_id) REFERENCES viewerTwitchUser (twitch_id)
	);`
]

const dropTableArr = [
	'DROP TABLE IF EXISTS streamUser;',

	'DROP TABLE IF EXISTS viewerTwitchUser;',

	'DROP TABLE IF EXISTS viewerDiscordUser;',

	'DROP TABLE IF EXISTS streamerViewerRel;'
]

module.exports = {
	connection: db => {
		if(!this.db)
			this.db = db
		return this.db
	},

	createTables: () => {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {
				for(let i = 0; i < createTablesArr.length; i++) {
					this.db.run(createTablesArr[i], err => {
						if(err) {
							reject(err)
						}
					})
				}
				resolve()
			})
		})
	},

	dropTables: () => {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {
				for(let i = 0; i < dropTableArr.length; i++) {
					this.db.run(dropTableArr[i], err => {
						if(err) {
							reject(err)
						}
					})
				}
				resolve()
			})
		})
	},

	insertIntoStreamer: (OAuth, user) => {
		const streamTableInsert = [user.user_id, OAuth.access_token, OAuth.refresh_token]
		const sql = 'INSERT OR REPLACE INTO streamUser(twitch_id, access_token, refresh_token) VALUES(?, ?, ?)'
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {

				this.db.run(sql, streamTableInsert, err => {
					if(err) {
						reject(err)
					}
				})
			})

			resolve()

		})
	},
	
	selectFromStreamer: twitch_id => {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {

				this.db.all('SELECT * FROM streamUser WHERE twitch_id = ?', [twitch_id],  (err, rows) => {

					if(!err)
						resolve(rows[0])

					else
						reject(err)
				})

			})
		})
	},

	insertIntoTwitchViewer: (twitchOAuth, twitchUser) => {
		const userTableInsert = [twitchUser.user_id, twitchUser.login, twitchOAuth.access_token, twitchOAuth.refresh_token]
		const sql = 'INSERT OR REPLACE INTO viewerTwitchUser(twitch_id, twitch_name, twitch_access_token, twitch_refresh_token) VALUES(?, ?, ?, ?)'

		return new Promise((resolve, reject) => {
			this.db.serialize(() => {

				this.db.run(sql, userTableInsert, err => {
					if(err) {
						reject(err)
					}
				})

				resolve()

			})
		})
	},

	selectFromTwitchViewer: twitch_id => {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {

				this.db.all('SELECT * FROM viewerTwitchUser WHERE twitch_id = ?', [twitch_id],  (err, rows) => {

					if(!err)
						resolve(rows[0])

					else
						reject(err)
				})

			})
		})
	},

	insertIntoDiscordViewer: (discordOAuth, discordUser, twitch_id) => {
		const userTableInsert = [discordUser.id, twitch_id, discordOAuth.access_token, discordOAuth.refresh_token, discordUser.email, `${discordUser.username}#${discordUser.discriminator}`, discordUser.avatar]
		const sql = 'INSERT OR REPLACE INTO viewerDiscordUser(discord_id, twitch_id, discord_access_token, discord_refresh_token, email, username, icon) VALUES(?, ?, ?, ?, ?, ?, ?)'

		return new Promise((resolve, reject) => {

			this.db.serialize(() => {

				this.db.run(sql, userTableInsert, err => {
					if(err) {
						reject(err)
					}
				})
			})


			const tsql = `UPDATE viewerTwitchUser SET discord_id = ${discordUser.id} WHERE twitch_id = ${twitch_id}`
			
			this.db.serialize(() => {

				this.db.run(tsql, err => {
					if(err) {
						reject(err)
					}
				})

				resolve()

			})
		})


	}

}