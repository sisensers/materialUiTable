const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const ZipPlugin = require('zip-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: "MaterialUiTable/MaterialUiTable.js",
        libraryTarget: "umd",
        path: path.resolve(__dirname, 'build'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                type: "asset/inline",
            },
        ],
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "MaterialUiTable/*.*", to: ".", context: "src/", },
                // { from: "other", to: "public" },
            ],
        }),

        new ZipPlugin({
            // OPTIONAL: defaults to the Webpack output path (above)
            // can be relative (to Webpack output path) or absolute
            path: '../zip',
      
            // OPTIONAL: defaults to the Webpack output filename (above) or,
            // if not present, the basename of the path
            filename: 'MaterialUiTable.zip',
          })
    ],
};