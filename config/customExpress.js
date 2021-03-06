const express = require('express')
const consign = require('consign')
const bodyPaser = require('body-parser')

module.exports = () => { 


	const app = express()

	app.use(bodyPaser.json())

	consign()
		.include('controllers')
		.into(app)

	return app
}

