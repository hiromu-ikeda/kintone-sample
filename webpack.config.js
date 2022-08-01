const path = require('path');
const glob = require('glob');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const autoUploadPlugin = require('./autoUpload');

const basePath = path.resolve('src', 'apps');

// basePath配下の各ディレクトリを複数のentryとする
const entries = glob.sync('**/index.+(js|ts|tsx)', {cwd: basePath}).reduce(
  (prev, file) => ({
    ...prev,
    [path.dirname(file)]: path.resolve(basePath, file),
  }),
  {}
);

module.exports = {
  entry: entries,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.ts' , '.tsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new autoUploadPlugin(),
  ],
};
