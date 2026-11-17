const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = (env) => ({
    mode: 'development',
    entry: '/src/index.js',
    output: {
        
        filename: env.prod ? 'main.[contenthash].js' : 'main.js',
        // publicPath: '/',
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|woff2)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(scss|css)$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  env.prod ? MiniCssExtractPlugin.loader : "style-loader",
                  // Translates CSS into CommonJS
                  "css-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
            },
        ],
      },
      plugins: [
        new HtmlWebpackPlugin({
        filename: env.prod ? 'index[contenthash].html' : 'index.html',
        title: 'Форма оплаты'
      }),
      new MiniCssExtractPlugin({
        filename: 'main[contenthash].css',
    }),
    ]
});