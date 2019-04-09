const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	module: {
		rules: [
			{
				test:/\.css$/,
				//loader:'style-loader!css-loader'
				use :['style-loader','css-loader'],
			},
			//{ test: /\.ts$/, use: 'ts-loader' }
			{ test: /\.js$/,
				exclude: /(node_modules|bower_components|dist|pycgi-log|sql)/,
				use: {
					loader: 'babel-loader',
					//options: { presets: ['@babel/preset-env'] }
				}
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				//loader:'style-loader!css-loader'
				use :['file-loader',
					//Minify PNG, JPEG, GIF, SVG and WEBP images with imagemin
					{
						loader: 'image-webpack-loader',
						options: {
							bypassOnDebug: true,
						},
					},
				]
			}

		]
	},
	entry: {
		//proto_game:'./src/proto-game.js',
		//proto_game:'./src/directional-light-test.js',
		//proto_game:'./src/spot-light-test.js',
      //main:'./src/Merry-Go-Round.js',
		//main:'./src/texture-dat.js',
		main:'./src/render2tex.js',
		//main:'./src/block-guy.js',
		//susan:'./src/Susan.js',
	},
	output: {
		filename: '[name]-bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	/*plugins:[
		new HtmlWebpackPlugin({
			filename:'proto-game.html',
			minify:{ removeAttributeQuotes: true, collapseWhitespace: true, html5: true, minifyCSS: true, removeComments: true, removeEmptyAttributes: true,
			},
			hash:true,
			template:'./src/proto-game-tpl.html',
			//excludeChunks:[],
			chunks:['proto_game'],
		}),
	],*/
	//devtool: 'source-map',
	devtool: 'cheap-eval-source-map',
};
