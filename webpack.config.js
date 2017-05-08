const path = require('path');

module.exports = {
    watch: true,
    entry: path.join(__dirname, 'www', 'js', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'www')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                        plugins: []
                    }
                }
            }
        ]
    }
};