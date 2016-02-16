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
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ],
  },
  resolve: {
    root: [
    ]
  }
};
