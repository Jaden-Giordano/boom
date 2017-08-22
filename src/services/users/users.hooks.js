const {
	authenticate
} = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
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

const userSchema = require('./users.schema');

module.exports = {
	before: {
		all: [],
		find: [authenticate('jwt')],
		get: [...restrict],
		create: [...userSchema.hooks, hashPassword()],
		update: [...restrict, ...userSchema.hooks, hashPassword()],
		patch: [...restrict, ...userSchema.hooks, hashPassword()],
		remove: [...restrict]
	},

	after: {
		all: [
			commonHooks.when(
				hook => hook.params.provider,
				commonHooks.discard('password', 'email')
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
