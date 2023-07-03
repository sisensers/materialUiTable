const webpack = require('webpack');
const prodConfig = require('./webpack.config');

module.exports = function override(config) {
    if (config.mode === 'production') {
        return prodConfig;
    }

    // config.entry = './src/index_dev.js';

    // config.plugins.push(
    //     new webpack.NormalModuleReplacementPlugin(
    //         /^@sbi\/styleguide$/,
    //         '@sbi/styleguide/dist/styleguide.js'
    //     )
    // );

    return config;
}