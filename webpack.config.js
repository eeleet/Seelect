'use strict';

var path = require('path');

module.exports = {
    entry: ['./src/js/main.js'],
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    "presets": ["es2015-ie"]
                }
            }
        ]
    },

    stats: {
        colors: true
    },

    devtool: 'source-map'
};