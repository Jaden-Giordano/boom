'use strict'
rethinkdbdash = require('rethinkdbdash')

module.exports = ->
	app = @
	config = app.get('rethinkdb')
	r = rethinkdbdash(config)
	oldSetup = app.setup
	app.set 'rethinkdbClient', r

	app.setup = ->
		_this = @
		_len = arguments.length
		args = Array(_len)
		_key = 0
		while _key < _len
			args[_key] = arguments[_key]
			_key++
		promise = Promise.resolve()
		# Go through all services and call the RethinkDB `init`
		# which creates the database and tables if they do not exist
		Object.keys(app.services).forEach (path) ->
			service = app.service(path)
			if typeof service.init == 'function'
				promise = promise.then(->
					service.init()
				)
			return
		# Access the initialization if you want to run queries
		# right away that depend on the database and tables being created
		@set 'rethinkInit', promise
		promise.then ->
			oldSetup.apply _this, args
		@

	return
