const { resolve } = require('path')
const { HotModuleReplacementPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
	plugins: [
		new HtmlWebpackPlugin({
			template: resolve(__dirname, './src/index.html'),
			filename: 'index.html',
		}),
		new HotModuleReplacementPlugin()
	],
	module: {
		rules: [
			{
				test: /\.(svg|png|jpg|jpeg|webp|gif)/,
				type: 'asset/resource',
			},
			{
				test: /\.css/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
		],
	},
}