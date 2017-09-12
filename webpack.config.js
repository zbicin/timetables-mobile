const path = require('path');

module.exports = {
    entry: {
        app: path.join(__dirname, 'www', 'js', 'index.ts'),
        test: path.join(__dirname, 'www', 'spec', 'index.ts')
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'www')
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
    }
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