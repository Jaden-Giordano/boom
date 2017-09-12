authenticate = require('feathers-authentication').hooks.authenticate
_require = require('feathers-hooks-common')
discard = _require.discard
validateSchema = _require.validateSchema
once = require('feathers-hooks-common').when
_require2 = require('feathers-authentication-hooks')
restrictToOwner = _require2.restrictToOwner
hashPassword = require('feathers-authentication-local').hooks.hashPassword
restrict = [
	authenticate('jwt')
	restrictToOwner(
		idField: 'id'
		ownerField: 'id')
]

ajv = require('ajv')
userSchema = require('./users.schema')
signup = require('../../hooks/signup')

module.exports =
	before:
		all: []
		find: [ authenticate('jwt') ]
		get: []
		create: [
			validateSchema(userSchema, ajv)
			hashPassword()
			signup()
		]
		update: [].concat(restrict, [
			validateSchema(userSchema, ajv)
			hashPassword()
		])
		patch: [].concat(restrict, [
			validateSchema(userSchema, ajv)
			hashPassword()
		])
		remove: [].concat(restrict)
	after:
		all: [ once(((hook) ->
			hook.params.provider
		), discard('password', 'email')) ]
		find: []
		get: []
		create: []
		update: []
		patch: []
		remove: []
	error:
		all: []
		find: []
		get: []
		create: []
		update: []
		patch: []
		remove: []
