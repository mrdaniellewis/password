const path = require('path');
const crypto = require('crypto');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function makeHash(source) {
  const hash = crypto
    .createHash('sha256')
    .update(source, 'utf8')
    .digest('base64');
  return `'sha256-${hash}'`;
}

module.exports = (_, { mode }) => ({
  node: false,
  entry: {
    main: './src/index.js',
    worker: './src/worker.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: mode === 'development' ? 'source-map' : false,
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        removeScriptTypeAttributes: true,
      },
      inlineSource: '\\.(js|css)$',
      makeHash,
      chunks: ['main'],
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackInlineSourcePlugin(),
  ],
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
});
