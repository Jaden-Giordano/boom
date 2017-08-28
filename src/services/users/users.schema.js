module.exports = {
	type: 'object',
	properties: {
		user: { type: 'string' },
		password: { type: 'string' },
		email: { type: 'string' },
		stats: {
			type: 'object',
			properties: {
				kills: { type: 'number', minimum: 0 },
				deaths: { type: 'number', minimum: 0 },
				bombs_placed: { type: 'number', minimum: 0 },
				powerups_used: { type: 'number', minimum: 0 },
				games_played: { type: 'number', minimum: 0 },
				wins: { type: 'number', minimum: 0 },
				losses: { type: 'number', minimum: 0 }
			},
			required: ['kills', 'deaths', 'bombs_placed', 'powerups_used', 'games_played', 'wins', 'losses']
		}
	},
	required: ['user', 'password']
};
