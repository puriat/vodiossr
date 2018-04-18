const withCss = require('@zeit/next-css')
const webpack = require('webpack');
const path = require('path')
const glob = require('glob')


module.exports = {
    webpack(config, { dev }) {
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
        }, {
                test: /\.(css|scss)/,
                loader: 'emit-file-loader',
                options: {
                    name: 'dist/[path][name].[ext]'
                }
            }
            ,
            {
                test: /\.css$/,
                use: ['babel-loader', 'raw-loader', 'postcss-loader']
            }
            ,
            {
                test: /\.s(a|c)ss$/,
                use: ['babel-loader', 'raw-loader', 'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: ['styles', 'node_modules']
                                .map((d) => path.join(__dirname, d))
                                .map((g) => glob.sync(g))
                                .reduce((a, c) => a.concat(c), [])
                        }
                    }
                ]
            })
        config.plugins.push(
            new webpack.ProvidePlugin({
                '$': 'jquery',
                jQuery: 'jquery'
            })
        );
        return config
    }
}
