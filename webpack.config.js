var path = require('path');
var NodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/object-table.jsx',
  output: {
    path: __dirname + '/dist',
    filename: 'object-table.js',
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
            'es2015',
            'stage-0',
          ],
        },
      },
    ],
  },
  resolve: {
    root: [
    ],
    extensions: [
      '',
      '.js',
      '.jsx',
    ],
  },
  externals: NodeExternals(),
};
