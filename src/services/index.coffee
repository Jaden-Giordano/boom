users = require('./users/users.service')

module.exports = ->
	app = @
	app.configure users
	return
