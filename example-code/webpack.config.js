module.exports = {
    entry: {
        filename: './app.js'
    },
    output: {
        filename: 'build/bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loaders: ['babel?presets[]=es2015'], exclude: /node_modules/ }
        ]
    }
};
