"use strict";

let webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    postcssImport = require('postcss-import');

let defaultConfig = {
    cache: true,
    entry: {
        'cbp-theme': './index.js',
        'inputmask': './inputmask.js',
        'jquery': [ 'jquery' ]
    },
    eslint: {
        configFile: '.eslintrc'
    },
    stats: {
        colors: true,
        reasons: true
    },
    devServer: {
        headers: { 'Access-Control-Allow-Origin': '*' },
        proxy: [{
            context: "/api",
            changeOrigin: true
        }]
    },
    module: {
        loaders: require('./webpack.loaders')
    },
    postcss: function (webpack) {
         return [
            postcssImport({
                addDependencyTo: webpack
            })
        ];
    },
    resolve: {
        root: [
            path.resolve('./app/'),
            path.resolve('./node_modules/')
        ],
        alias : {
            "inputmask.dependencyLib": path.resolve('./node_modules/jquery.inputmask/dist/inputmask/inputmask.dependencyLib.jquery.js'),
            "inputmask": path.resolve('./node_modules/jquery.inputmask/dist/inputmask/inputmask.js'),
            "jquery.inputmask": path.resolve('./node_modules/jquery.inputmask/dist/inputmask/jquery.inputmask.js')
        },
        extensions: [ '', '.json', '.js', '.min.js', '.bundle.js', '.css', '.min.css', '.scss', '.html' ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', Infinity), // name, chucks/filename, minchunk
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new ExtractTextPlugin('styles.css', {
          publicPath: "./",
          allChunks : false
        })
    ]
};

let kitchensinkConfig = Object.assign({}, defaultConfig, {
    entry: Object.assign({}, defaultConfig.entry, { 'vendor': [ 'select2', 'selectize' ] }),
    output: {
        path: path.resolve('./app/kitchensink/dist'),
        filename: '[name].js',
        publicPath: './',
        chunkFilename: "[hash]/js/[id].js"
    }
});

let standardDistConfig = Object.assign({}, defaultConfig, {
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js',
        publicPath: './',
        chunkFilename: "[hash]/js/[id].js"
    }
});

module.exports = [ kitchensinkConfig, standardDistConfig ];
