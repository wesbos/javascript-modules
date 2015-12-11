module.exports = {
    entry: {
        filename: './app.js'
    },
    output: {
        filename: 'build/bundle.js'
    },
    module: {
        loaders: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel',
              query: {
                presets: ['es2015']
              }
            }
        ]
    }
};
