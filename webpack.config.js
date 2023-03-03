/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: "development",
  entry: './client/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: { loader: "babel-loader"} },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.svg$/,use: [{loader: 'svg-inline-loader'}] },
      { test: /\.(png|jpe?g|gif)$/i, use: [{ loader: 'url-loader', options: {limit: 8192} }] },
    ]
  },
  devServer: {
    historyApiFallback: true,
    static: {
     directory: path.join(__dirname, "/"),
   },
    port: 8081,
    open: true
  },
  optimization: {
    minimize: false
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/public/index.html'
    })
  ]
}