var path = require('path');

module.exports = {
  entry: './demo.jsx',
  output: {
    path: __dirname + '/dist',
    filename: 'demo.js',
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
          ]
        },
      }
    ],
  },
  resolve: {
    root: [
    ],
    extensions: [
      '',
      '.js',
      '.jsx',
    ]
  }
};
