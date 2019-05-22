'use strict';

const webpack                    = require('webpack');
const express                    = require('express');
const fs                         = require('fs');
const path                       = require('path');
const UglifyJsPlugin             = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin       = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin    = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin         = require('clean-webpack-plugin');
const glob                       = require('glob');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const randomString               = require('random-string');
const IncludeFileWebpackPlugin   = require('include-file-webpack-plugin');
const moment                     = require('moment');
const WebpackDevServer           = require('webpack-dev-server');
const json                       = JSON.parse(fs.readFileSync('./package.json'));
const webpackDevMiddleware       = require('webpack-dev-middleware');
const ConcatPlugin               = require('webpack-concat-plugin');
const minify                     = require('@node-minify/core');
const uglifyJS                   = require('@node-minify/uglify-js');


let globs = {
	port                : 8080,
	examples            : 'examples',
	build               : 'src',
	dist                : 'dist'
};



/*! 
 *************************************
 * Site Info
 *************************************
 */

let customWebsiteVersion     = json.version,
	customWebsiteAuthor      = json.author,
	customWebsiteTitle       = 'React DD Builder',
	customWebsiteDesc        = 'React DD Builder is a set of React drag and drop tool to help you build beautiful website interfaces while keeping responsive and third-party framework compatible.',
	customWebsiteCanonical   = '<link rel="canonical" href="https://uiux.cc" />',
	customWebsiteGenerator   = 'React DD Builder',
	customWebsiteHash        = randomString({length: 20}),
	customWebsiteComment     = `
## Project Name        :  ` + customWebsiteTitle + `
## Version             :  ` + customWebsiteVersion + `
## Based on            :  React DD Builder (https://github.com/xizon/react-dd-builder)
## Last Update         :  ` + moment().format( "MMMM D, YYYY" ) + `
## Created by          :  UIUX Lab (https://uiux.cc)
## Contact Us          :  uiuxlab@gmail.com
## Released under the GPL 3 license.
	`;


// Get all the HTML template files


let tempAllPages = glob.sync( './'+globs.build+'/components/**/*.html' );
let targetTempFilesName = [];
let targetAllTempFilesName = [];

tempAllPages.map( ( event ) => {
	let filename = event.split( '/' ).pop();
	
	targetAllTempFilesName.push( [ event, event.split( '/' ).pop() ] );
	
	if ( filename.indexOf( 'include-' ) < 0 ) {
		targetTempFilesName.push( [ event, event.split( '/' ).pop() ] );
	}
	
});



let targetFilesNameArrays = [
  targetAllTempFilesName
];
let targetAllWatchFilesName = [].concat(...targetFilesNameArrays);

//console.log( targetAllWatchFilesName );




/*! 
 *************************************
 *  Main configuration
 *************************************
 */
const webpackConfig = {
	devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
    mode: 'production',
	watch: true,
	node: { fs: 'empty' },
    resolve: {
        extensions: ['.js', '.es6', '.vue', '.jsx' ]
    },
	
	//Exclude react from bundle
//    externals: {
//      'react': 'React',
//		'react-dom': 'ReactDOM'
//    },
	
	entry: {
		'app': './'+globs.build+'/index.js',
		'app.min': './'+globs.build+'/index.js'
	},
    output: {
        path: path.resolve(__dirname, './' + globs.dist + '/js' ),
        filename: '[name].js'
    },

	optimization: {
	    minimizer: [

			new UglifyJsPlugin({
				sourceMap: true,
				test: /\.min\.js$/i,
			}),
			
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: '../css/[name].css'
			}),
			new OptimizeCssAssetsPlugin({
				assetNameRegExp: /\.min\.css$/g,
				cssProcessorPluginOptions: {
				    preset: ['default', { discardComments: { removeAll: false } }],
				},
				canPrint: true
			}),
	
		],
		
	},
    module: {
        rules: [
			{
				test: /\.json$/,
				use: 'json-loader'
			},
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: path.resolve( __dirname, 'node_modules' ),
                query: {  
				  'presets': [
					  '@babel/preset-env', 
					  '@babel/preset-react',
						{
						  plugins: [
							'@babel/plugin-proposal-class-properties'
						  ]
						}	  
				  ]
                }
			},
			{
				
				test: /\.(sa|sc|c)ss$/,
				include: path.resolve( __dirname, './' + globs.build ),
				use: [

					// fallback to style-loader in development
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader',
					'sass-loader',

					
				]
			},
			
			{
				test: /\.html$/,
				use: [ 
					{
						loader: 'html-loader',
						options: {
							minimize: false,
							removeComments: false,
							collapseWhitespace: false
						}
					}
				]
			},
			
		
        ],
		
		

    },
	plugins: [
		
	]
	
	
};

/*! 
 *************************************
 *  Remove include files and extra CSS files
 *************************************
 */
webpackConfig.plugins.push(
    new CleanWebpackPlugin([
		globs.build + '/**/*.css',
		globs.examples + '/*.html',
		
	]),
	
	new webpack.BannerPlugin( customWebsiteComment ),
	
);

/*! 
 *************************************
 *  Batch processing HTML template files
 *************************************
 */
targetTempFilesName.map( ( event ) => {
	
	webpackConfig.plugins.push(
		
		new IncludeFileWebpackPlugin({
			directory: '',
			input: `${event[0]}`,
			output: `./${globs.examples}/${event[1]}`,
			processIncludeContents: function(html) {
				return html;
			}
		}),	
		
		new ReplaceInFileWebpackPlugin([
			{
				dir: globs.examples,
				files: [ event[1], event[1] ],
				rules: [
					{ search: '@@{website_title}', replace: customWebsiteTitle },
					{ search: '@@{website_desc}', replace: customWebsiteDesc },
					{ search: '@@{website_canonical}', replace: customWebsiteCanonical },
					{ search: '@@{website_author}', replace: customWebsiteAuthor },
					{ search: '@@{website_generator}', replace: customWebsiteGenerator },
					{ search: '@@{website_version}', replace: customWebsiteVersion },
					{ search: '@@{website_comment}', replace: customWebsiteComment },
					{ search: '@@{website_hash}', replace: customWebsiteHash },

				]
			}
		]),	
		
		
	);
});

/*! 
 *************************************
 *  Add .min.css files souce map
 *************************************
 */
webpackConfig.plugins.push(
	new webpack.SourceMapDevToolPlugin({
	  filename: '../css/[name].css.map',
	}),

);




/*! 
 *************************************
 *  Hook our plugins to fix webpack dev server is not serving the latest compiled code
 *************************************
 */
const compiler = webpack( webpackConfig );
const app = express();
const instance = webpackDevMiddleware( compiler );
app.use( instance );


//Watch for Files Changes in Node.js
require('log-timestamp');

targetAllWatchFilesName.map( ( event ) => {
	
	let curFile = `${event[0]}`;

	fs.watchFile( curFile, (curr, prev) => {
	    console.log(`${curFile} file Changed`);
		
		// After a short delay the configuration is changed and a banner plugin is added
		// to the config
		compiler.apply(

			new CleanWebpackPlugin([
				globs.build + '/**/*.css'
			])

		);
	
		targetTempFilesName.map( ( event ) => {

			compiler.apply(

				new IncludeFileWebpackPlugin({
					directory: '',
					input: `${event[0]}`,
					output: `./${globs.examples}/${event[1]}`,
					processIncludeContents: function(html) {
						return html;
					}
				}),

				new ReplaceInFileWebpackPlugin([
					{
						dir: globs.examples,
						files: [ event[1], event[1] ],
						rules: [
							{ search: '@@{website_title}', replace: customWebsiteTitle },
							{ search: '@@{website_desc}', replace: customWebsiteDesc },
							{ search: '@@{website_canonical}', replace: customWebsiteCanonical },
							{ search: '@@{website_author}', replace: customWebsiteAuthor },
							{ search: '@@{website_generator}', replace: customWebsiteGenerator },
							{ search: '@@{website_version}', replace: customWebsiteVersion },
							{ search: '@@{website_comment}', replace: customWebsiteComment },
							{ search: '@@{website_hash}', replace: customWebsiteHash },

						]
					}
				])

			);

		

		});

		// Recompile the bundle with plugins:
		instance.invalidate();	
	});
	
});




/*! 
 *************************************
 *  Listen the server
 *************************************
 */

const server = new WebpackDevServer( compiler, {
					contentBase: [
						path.resolve(__dirname, './' )
					],
	                hot: true,
					watchContentBase: true,
	
				});

server.listen( globs.port, "localhost", function (err, result) {
	if (err) {
	    return console.log(err);
	}


	console.log('Listening at http://localhost:8080/');
})

/*! 
 *************************************
 *  Build a table of contents (TOC)
 *************************************
 */

compiler.plugin( 'done', () => { 
	
	
	let targetJSFile          = './'+globs.dist+'/js/app.js',
		targetJSMinFile       = './'+globs.dist+'/js/app.min.js';
	
	fs.readFile( targetJSFile, function(err, data ){


		//Update the compressed js file
		minify({
			compressor: uglifyJS,
			input: targetJSFile,
			output: targetJSMinFile,
			callback: function(err, min) {

				if ( err ) {
					console.log( '=============[ ERROR: Please Rebuild! ]================' + err );
				} else {
					console.log( targetJSMinFile + ' compressed successfully!' );
				}


			}
		});	


	});

	

});
			
									
									
/*! 
 *************************************
 *  Exporting webpack module
 *************************************
 */
module.exports = webpackConfig;


