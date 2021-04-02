const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: {
        app: './src/index.js',
    },
    output: {
        filename: 'arche-api.min.js',
        path: path.resolve(__dirname, 'lib'),
        clean: true,
        library: {
            name: 'ARCHEapi',
            type: 'umd',
        }, 
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            loader: 'babel-loader',
          },
        ],
    }, 
    resolve: {
        fallback: {
          'https': require.resolve('node-fetch'),
          'http': require.resolve('node-fetch'),
          'stream': require.resolve('node-fetch'),
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.NODE_DEBUG': JSON.stringify('production'),
        })
    ],
    externals: {
        fetch: {
            commonjs: 'node-fetch',
            commonjs2: 'node-fetch',
            amd: 'node-fetch',
            root: 'fetch',
        },
        stream: {
            commonjs: 'readable-stream',
            commonjs2: 'readable-stream',
            amd: 'readable-stream',
            root: 'stream',
        },
        http: {
            commonjs: 'readable-stream',
            commonjs2: 'readable-stream',
            amd: 'readable-stream',
            root: 'http',
        },
        https: {
            commonjs: 'readable-stream',
            commonjs2: 'readable-stream',
            amd: 'readable-stream',
            root: 'https',
        },
    }, 
    optimization: {
        chunkIds: "size",
        // method of generating ids for chunks
        moduleIds: "size",
        // method of generating ids for modules
        mangleExports: "size",
        // rename export names to shorter names
        minimize: true,
        // minimize the output files
        minimizer: [
            new TerserPlugin({
                extractComments: true,
                parallel: true,
                terserOptions: {
                    ecma: undefined,
                    parse: {},
                    compress: {},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: false,
                    // Deprecated
                    output: null,
                    format: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false
                },
            })
        ],
    },
};