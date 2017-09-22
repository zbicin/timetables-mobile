const path = require('path');
const webpack = require('webpack');
const WebpackGenerateIndexes = require('./scripts/webpack-generate-indexes');

module.exports = {
    entry: {
        app: path.join(__dirname, 'www', 'js', 'bootstrap.ts')
        //test: path.join(__dirname, 'www', 'spec', 'index.ts')
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'www')
    },
    resolve: {
        extensions: ['.js', '.json', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015'],
                            plugins: []
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.css$/, use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            { test: /\.png$/, use: 'url-loader' }
        ]
    },
    plugins: [
        new webpack.WatchIgnorePlugin([
            path.join(__dirname, 'platforms'),
            path.join(__dirname, 'www', 'app.js'),
            path.join(__dirname, 'www', 'test.js'),
            'index.ts'
        ])
    ]
    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             exclude: /(node_modules|bower_components)/,
    //             use: {
    //                 loader: 'babel-loader',
    //                 options: {
    //                     presets: ['es2015'],
    //                     plugins: []
    //                 }
    //             }
    //         },
    //         {
    //             test: /\.css$/,
    //             exclude: /(node_modules|bower_components)/,
    //             use: {
    //                 loader: 'css-loader',
    //                 loader: 'style-loader'
    //             }
    //         },
    //         {
    //             test: /\.png$/,
    //             exclude: /(node_modules|bower_components)/,
    //             use: {
    //                 loader: 'url-loader'
    //             }
    //         },
    //     ]
    // }
};