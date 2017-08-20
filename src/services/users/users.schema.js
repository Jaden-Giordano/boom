const feathers_schema = require('feathers-schema');
const Schema = feathers_schema.Schema;

module.exports = new Schema({
	user: { type: String, required: true },
	password: { type: String, required: true },
	email: String,
	name: String,
	stats: {
		kills: { type: Number, default: 0, range: ['>=', 0, 'cannot have less than 0 kills.'] },
		deaths: { type: Number, default: 0, range: ['>=', 0, 'cannot have less than 0 deaths.'] },
		bombs_placed: { type: Number, default: 0, range: ['>=', 0, 'cannot have less than 0 bombs placed.'] },
		powerups_used: { type: Number, default: 0, range: ['>=', 0, 'cannot have less than 0 powerups used.'] },
		games_played: { type: Number, default: 0, range: ['>=', 0, 'cannot have less than 0 games played.'] },
		wins: { type: Number, default: 0, range: ['>=', 0, 'cannot have less than 0 wins.'] },
		losses: { type: Number, default: 0, range: ['>=', 0, 'cannot have less than 0 losses.'] }
	}
});
