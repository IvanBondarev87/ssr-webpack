import path from 'path';
import { DefinePlugin, Configuration } from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ReactRefreshTypeScript from 'react-refresh-typescript';

const isDevelopmentMode = process.env.NODE_ENV !== 'production';

const getCustomTransformers = () => ({
  before: [ReactRefreshTypeScript()],
});

const developmentPlugins = [
  new ReactRefreshWebpackPlugin(),
];

export const browserConfig: Configuration = {

  mode: isDevelopmentMode ? 'development' : 'production',
  devtool: isDevelopmentMode ? 'source-map' : undefined,
  target: 'web',

  entry: './src/bootstrap.tsx',

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: path.resolve(__dirname, './src'),
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            ...isDevelopmentMode && { getCustomTransformers },
          },
        },
      },
    ],
  },

  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  plugins: [
    ...isDevelopmentMode && developmentPlugins,
    new DefinePlugin({ isServerRendering: false })
  ],

  optimization: {
    chunkIds: 'named',
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

};

export const serverConfig: Configuration = {

  mode: isDevelopmentMode ? 'development' : 'production',
  devtool: isDevelopmentMode ? 'source-map' : undefined,
  target: 'node',

  entry: './src/prerender.tsx',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs',
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [path.resolve(__dirname, './src'), path.resolve(__dirname, './dev-toolkit')],
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },

  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  plugins: [
    new DefinePlugin({ isServerRendering: true })
  ],

};
