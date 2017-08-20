const feathers_schema = require('feathers-schema');
const Schema = feathers_schema.Schema;

module.exports = new Schema({
	user: { type: String, required: true },
	password: { type: String, required: true },
	email: String,
	name: String
});
