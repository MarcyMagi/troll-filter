const createTablesStr = 
	`CREATE TABLE IF NOT EXISTS streamUser (
		twitch_id int PRIMARY KEY,
		access_token nvarchar(255) UNIQUE NOT NULL,
		refresh_token nvarchar(255) UNIQUE NOT NULL
	);
	
	
	CREATE TABLE IF NOT EXISTS playerUser (
		twitch_id int PRIMARY KEY,
		discord_id int UNIQUE NOT NULL,
	);
	
	
	CREATE TABLE IF NOT EXISTS streamerPlayerRel (
		stream_id int NOT NULL,
		player_id int NOT NULL,
		relation int NOT NULL,
		FOREIGN KEY (stream_id) REFERENCES streamUser (twitch_id),
		FOREIGN KEY (player_id) REFERENCES playerUser (twitch_id)
	);`

const dropTableStr = 
	`DROP TABLE IF EXISTS streamUser;
	

	DROP TABLE IF EXISTS scope;
	

	DROP TABLE IF EXISTS playerUser;
	

	DROP TABLE IF EXISTS streamerPlayerRel;`

let db

module.exports = {
	connection: db => {
		if(!this.db)
			this.db = db
	},

	createTables: () => {
		
		this.db.serialize(() => {
			this.db.run(createTablesStr)
		})
	},

	dropTables: () => {
	   this.db.serialize(() => {
			this.db.run(dropTableStr)
		})
	},

	insertIntoStreamer: (OAuth, user) => {
		const streamTableInsert = [user.user_id, OAuth.access_token, OAuth.refresh_token]
		const sql = 'INSERT OR REPLACE INTO streamUser(twitch_id, access_token, refresh_token) VALUES(?, ?, ?)'

		this.db.serialize(() => {

			this.db.run(sql, streamTableInsert, err => {
				if(err) {
					console.log(err)
				}
			})
		})
	},
	
	selectFromStreamer: twitch_id => {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {

				this.db.all(`SELECT * FROM streamUser WHERE twitch_id = ?`, [twitch_id],  (err, rows) => {

					if(!err)
						resolve(rows[0])

					else
						reject(err)
				})

			})
		})

	}

}