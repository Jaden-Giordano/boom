validateEmail = (email) ->
	re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	re.test email

errors = require('feathers-errors')

module.exports = ->
	options = if arguments.length > 0 and arguments[0] != undefined then arguments[0] else {}
	(hook) ->
		new Promise((resolve, reject) ->
			if hook.data
				if hook.data.email and hook.data.user and hook.data.password
					if !validateEmail(hook.data.email)
						return reject(new (errors.BadRequest)('Not a valid email address'))
				users_service = hook.app.service('users')

				await users_service.find(query:
					user: $search: hook.data.user
					$limit: 1)
				.then((result) ->
					return reject(new (errors.BadRequest)('Username already taken.')) if result.data.length > 0
				, (err) -> reject err)

				await users_service.find(query:
					user: $search: hook.data.email
					$limit: 1)
				.then((result) ->
					return reject(new (errors.BadRequest)('Email already registered to an account.')) if result.data.length > 0
				, (err) -> reject err)

				return resolve(hook)
			else
				return reject(new (errors.BadRequest)('Cannot submit empty form.'))
			return
		)
