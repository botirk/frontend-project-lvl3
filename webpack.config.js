import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  target: 'web',
  mode: process.env.NODE_ENV || 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    clean: true,
  },
};
