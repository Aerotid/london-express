const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build'),
    data: path.join('src', 'data'),
};

console.log(process.env);

const pages = JSON.parse(fs.readFileSync('pages.json')
    .toString())
    .map((pageData) => new HtmlWebpackPlugin({
        minify: false,
        title: pageData.title,
        filename: path.join(PATHS.build, `${pageData.name}.html`),
        template: path.join('src', 'pages', pageData.name, `${pageData.name}.pug`),
        chunks: pageData.name === 'tests' ? ['test', 'vendors'] : ['common', 'vendors'],
    }));

const data = {};
fs.readdirSync(PATHS.data)
    .forEach((file) => {
        const dataSetName = file.replace(/\.[^.]*$/, '');
        try {
            data[dataSetName] = JSON.parse(fs.readFileSync(path.join(PATHS.data, file)));
        } catch (e) {
        }
    });

module.exports = function (env, argv) {
    return {
        externals: {
            paths: PATHS,
        },
        entry: {
            common: `${PATHS.src}/common/js/common.js`,
        },
        output: {
            path: PATHS.build,
            filename: argv.mode === 'development' ? 'js/[name].js' : 'js/[name].[hash:8].js',
            publicPath: '/',
        },
        optimization: {
            minimizer: [new UglifyJsPlugin()],
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: 'vendors',
                        test: /node_modules/,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\.pug$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                minimize: false,
                                attrs: ['use:xlink:href', 'link:href', ':src', ':data-src', ':data-main-src', ':data-hover-src', ':srcset', ':data-srcset', ':data-bg-src', ':data-srcset', 'video:src', 'video:poster'],
                                interpolate: true,
                            },
                        },
                        {
                            loader: 'pug-html-loader',
                            options: {
                                pretty: argv.mode === 'development',
                                data: { data },
                            },
                        },
                    ],
                },
                {
                    test: /\.js$/,
                    exclude: [/node_modules/],
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true },
                        }, {
                            loader: 'postcss-loader',
                            options: { sourceMap: true, config: { path: './postcss.config.js' } },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true },
                        },
                        {
                            loader: 'postcss-loader',
                            options: { sourceMap: true, config: { path: './postcss.config.js' } },
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true },
                        },
                    ],
                },
                {
                    test: /\.(png|jpg|gif|mp4|webp|svg)$/,
                    loader: 'file-loader',
                    exclude: [
                        path.join(PATHS.src, '/common/icons')
                    ],
                    options: {
                        name: 'images/[name].[hash:8].[ext]',
                    },
                },
                {
                    test: /\.svg$/,
                    include: [
                        path.join(PATHS.src, '/common/icons')
                    ],
                    use: [{
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'sprite.svg',
                        }
                    }]
                },
                {
                    test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                    },
                },
            ],
        },
        node: { fs: 'empty' },
        target: 'web',
        plugins: [
            new CleanWebpackPlugin(),
            ...pages,
            new SpriteLoaderPlugin({ plainSprite: true }),
            new MiniCssExtractPlugin({
                filename: argv.mode === 'development' ? 'css/[name].css' : 'css/[name].[hash:8].css',
            }),
            // new BundleAnalyzerPlugin(),
        ],
        devServer: {
            host: 'localhost',
            setup(app) {
                app.post('*', (req, res) => {
                    res.send('POST res sent from webpack dev server');
                });
            },
        },
        resolve: {
            alias: {
                TweenMax: path.resolve(
                    'node_modules',
                    'gsap/src/minified/TweenMax.min.js',
                ),
                TweenLite: path.resolve(
                    'node_modules',
                    'gsap/src/minified/TweenLite.min.js',
                ),
                TimelineMax: path.resolve(
                    'node_modules',
                    'gsap/src/minified/TimelineMax.min.js',
                ),
                ScrollToPlugin: path.resolve(
                    'node_modules',
                    'gsap/src/minified/plugins/ScrollToPlugin.min.js',
                ),
                ScrollMagic: path.resolve(
                    'node_modules',
                    'scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
                ),
                'debug.addIndicators': path.resolve(
                    'node_modules',
                    'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js',
                ),
                'animation.gsap': path.resolve(
                    'node_modules',
                    'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js',
                ),
                // Для минифицированной версии Inputmask, может позже убрать, если они пофиксят пути
                './dependencyLibs/inputmask.dependencyLib': path.resolve(
                    'node_modules',
                    'inputmask/dist/min/inputmask/dependencyLibs/inputmask.dependencyLib.min',
                ),
                './global/window': path.resolve(
                    'node_modules',
                    'inputmask/dist/min/inputmask/global/window.min',
                ),
                '../global/window': path.resolve(
                    'node_modules',
                    'inputmask/dist/min/inputmask/global/window.min',
                ),
            },
        },
    };
};
