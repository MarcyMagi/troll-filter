const createTablesStr = 
	`CREATE TABLE IF NOT EXISTS streamUser (
		twitch_id int PRIMARY KEY,
		name nvarchar(255) UNIQUE NOT NULL,
		access_token nvarchar(255) UNIQUE NOT NULL,
		refresh_token nvarchar(255) UNIQUE NOT NULL
	);
	
	
	CREATE TABLE IF NOT EXISTS playerUser (
		twitch_id int PRIMARY KEY,
		twitch_name nvarchar(255) UNIQUE NOT NULL,
		discord_id int UNIQUE NOT NULL,
		discord_name nvarchar(255) UNIQUE NOT NULL
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
		const streamTableInsert = [user.user_id, user.login, OAuth.access_token, OAuth.refresh_token]
		const sql = 'INSERT INTO streamUser(twitch_id, name, access_token, refresh_token) VALUES(?, ?, ?, ?)'

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
				this.db.each(`SELECT * FROM streamUser WHERE twitch_id = ?`, [twitch_id],  (err, row) => {
					if(!err)
						resolve(row)
					else
						reject(err)
				}) 
			})
		})

	}

}