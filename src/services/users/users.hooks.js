const {
	authenticate
} = require('feathers-authentication').hooks;
const { when, discard, validateSchema } = require('feathers-hooks-common');
const {
	restrictToOwner
} = require('feathers-authentication-hooks');

const {
	hashPassword
} = require('feathers-authentication-local').hooks;
const restrict = [
	authenticate('jwt'),
	restrictToOwner({
		idField: 'id',
		ownerField: 'id'
	})
];

const ajv = require('ajv');
const userSchema = require('./users.schema');

module.exports = {
	before: {
		all: [],
		find: [authenticate('jwt')],
		get: [],
		create: [validateSchema(userSchema, ajv), hashPassword()],
		update: [...restrict, validateSchema(userSchema, ajv), hashPassword()],
		patch: [...restrict, validateSchema(userSchema, ajv), hashPassword()],
		remove: [...restrict]
	},

	after: {
		all: [
			when(
				hook => hook.params.provider,
				discard('password', 'email')
			)
		],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},

	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};
