const path = require('path')
const webpack = require('webpack')

const env = process.env.NODE_ENV || 'development'

module.exports = {
  devtool: 'eval',
  mode: env,
  entry: path.resolve(__dirname, 'src', 'app.example.tsx'),
  output: {
    path: path.resolve(__dirname, 'example'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}