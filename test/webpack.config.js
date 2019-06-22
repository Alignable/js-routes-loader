const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'js-routes-loader',
        type: "javascript/auto",
      },
    ],
  },
  devtool: 'inline-cheap-module-source-map',
};
