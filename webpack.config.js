const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const JS_DIR = path.resolve(__dirname, 'src/js');
const BUILD_DIR = path.resolve(__dirname, 'build');

// Get all components files.
const components = glob.sync('./src/js/components/*.js');

// Create entry points for each component.
const componentEntries = components.reduce((accumulator, component) => {
	const name = path.basename(component, '.js');
	accumulator[`components/${name}`] = component;
	return accumulator;
}, {});

// Get all style files.
const styles = glob.sync('./src/scss/*.scss');

// Create entry points for each style.
const cssFileEntries = styles.reduce((accumulator, component) => {
	const name = path.basename(component, '.scss');
	accumulator[`${name}`] = component;
	return accumulator;
}, {});

const defaultEntry = {
	index: JS_DIR + '/index.js',
}

// entry object for webpack.
const entry = Object.assign({}, defaultEntry, componentEntries, cssFileEntries);

// Output object for webpack.
const output = {
	path: BUILD_DIR,
	filename: 'js/[name].js',
};

// Plugins for webpack.
const plugins = [

	new CleanWebpackPlugin(),

	new MiniCssExtractPlugin({
		filename: 'css/[name].css'
	}),

	new StyleLintPlugin({
		files: ['**/*.scss'],
	})
];

// Rules for webpack.
const rules = [
	{
		test: /\.js$/,
		include: [JS_DIR],
		exclude: /node_modules/,
		use: 'babel-loader',
	},
	{
		test: /\.scss$/,
		exclude: /node_modules/,
		use: [
			MiniCssExtractPlugin.loader,
			'css-loader',
			'postcss-loader',
			'sass-loader',
		]
	}
];

const optimization = [
	new CssMinimizerPlugin(),
];

module.exports = () => ({
	entry,
	output,
	plugins,
	module: { rules },
	optimization: {
		minimizer: optimization,
	}
});