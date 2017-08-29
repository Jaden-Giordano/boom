const errors = require('feathers-errors');

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

module.exports = function(options = {}) { // eslint-disable-line no-unused-vars
	return function signup(hook) {
		return new Promise(async (resolve, reject) => {
			if (hook.data) {
				if (hook.data.email && hook.data.user && hook.data.password) {
					if (!validateEmail(hook.data.email))
						return reject(new errors.BadRequest('Not a valid email address'));

					let users_service = hook.app.service('users');

					await users_service.find({
						query: {
							user: {
								$search: hook.data.user
							},
							$limit: 1
						}
					}).then(result => {
						if (result.data.length > 0)
							return reject(new errors.BadRequest('Username already taken.'));
					}).catch(err => reject(err));

					await users_service.find({
						query: {
							email: {
								$search: hook.data.email
							},
							$limit: 1
						}
					}).then(result => {
						if (result.data.length > 0)
							return reject(new errors.BadRequest('Email already registered to an account.'));
					}).catch(err => reject(err));

					return resolve(hook);
				}
			} else {
				return reject(new errors.BadRequest('Cannot submit empty form.'));
			}
		});
	};
};
