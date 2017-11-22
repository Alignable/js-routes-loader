const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.json/,
        use: 'js-routes-loader',
      },
    ],
  },
  devtool: 'inline-cheap-module-source-map',
};
