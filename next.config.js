const withCss = require('@zeit/next-css')
const webpack = require('webpack');

module.exports = withCss({
    webpack(config) {
        config.module.rules.push({
            test: /\.(gif|png|svg|eot|otf|ttf|woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000,
                    publicPath: './',
                    outputPath: 'static/',
                    name: '[name].[ext]'
                }
            }
        })
        config.plugins.push(
            new webpack.ProvidePlugin({
                '$': 'jquery',
                jQuery: 'jquery'
            })
        );
        return config
    }
})
