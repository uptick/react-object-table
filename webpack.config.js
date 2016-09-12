var path = require('path');

module.exports = {
  entry: './src/object-table.jsx',
  output: {
    path: __dirname + '/dist',
    filename: 'object-table.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      }
    ],
  },
  resolve: {
    root: [
    ],
    extensions: [ '', '.js', '.jsx' ]
  }
};
