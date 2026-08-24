const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		historyApiFallback: true,
		static: path.resolve(__dirname, './dist'),
		port: 8080,
		open: true,
		hot: true,
	},
	plugins: [
		new ReactRefreshWebpackPlugin(),
		// Подменяем NODE_ENV на production - для React Profiler
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
	],
};
