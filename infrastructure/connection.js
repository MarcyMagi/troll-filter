const sqlite3 = require('sqlite3').verbose()

module.exports = new Promise((resolve) => {
	const db = new sqlite3.Database('infrastructure/databaseTest.sql')
	resolve(db)
}) 