const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [{
		entry: path.join(__dirname, 'public-src', 'index.coffee'),
    // TODO: Switch to vue.
		output: {
			path: path.join(__dirname, 'public'),
			filename: 'bundle.js',
		},
		module: {
			rules: [{
					test: /\.vue$/,
					use: ['vue-loader']
				},
				{
					test: /\.coffee$/,
					use: [{
						loader: 'coffee-loader',
						options: {
							sourceMap: true
						}
					}]

				},
				{
					test: /\.stylus$/,
					use: ['stylus-loader']
				},
				{
					test: /\.pug$/,
					use: ['pug-loader']
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: path.join(__dirname, 'public-src', 'index.pug')
			})
		]
	}
];
