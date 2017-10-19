var path = require('path');
var NodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/object-table.jsx',
  output: {
    path: __dirname + '/dist',
    filename: 'react-object-table.js',
    library: 'react-object-table',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: [
            'react',
            'env',
            'stage-0',
          ],
        },
      },
    ],
  },
  externals: NodeExternals(),
};
