module.exports = {
    entry: './index.jsx',
    output: {
        filename: 'bundle.js',
        // make sure port 8090 is used when launching webpack-dev-server
        publicPath: 'http://localhost:8090/assets'
    },
    module: {
        loaders: [
            {
                // tell webpack to use babel for all *.jsx files
                test: /\.jsx$/,
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
