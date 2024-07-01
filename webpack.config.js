const { resolve } = require('path')

module.exports = {
	mode: 'development',

	devServer: {
		static: {
			directory: resolve(__dirname, '.'),
		},
        historyApiFallback: true,
        open: false,
        compress: true,
        hot: true,
        port: 3000,
    },

	entry: {
		main: resolve(__dirname, './src/index.js')
	},

	output: {
		path: resolve(__dirname, './dist'),
		filename: '[name].bundle.js',
	},
}