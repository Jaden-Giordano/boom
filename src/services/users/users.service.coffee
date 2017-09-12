# Initializes the `users` service on path `/users`
createService = require('feathers-rethinkdb')
hooks = require('./users.hooks')
filters = require('./users.filters')

module.exports = ->
	app = @
	Model = app.get('rethinkdbClient')
	paginate = app.get('paginate')
	options =
		name: 'users'
		Model: Model
		paginate: paginate
	# Initialize our service with any options it requires
	app.use '/users', createService(options)
	# Get our initialized service so that we can register hooks and filters
	service = app.service('users')
	service.hooks hooks
	if service.filter
		service.filter filters
	return
