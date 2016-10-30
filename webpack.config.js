const path = require('path')
const config = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'public/'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      include: __dirname,
      query: {
        cacheDirectory: true,
        presets: ['es2015', 'react']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  cache: true,
  devtool: 'source-map',
  devServer: {
    port: 9000,
    host: '0.0.0.0'
  }
}

module.exports = config
