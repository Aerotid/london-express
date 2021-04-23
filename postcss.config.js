const purgecssFromPug = require('purgecss-from-pug');

module.exports = {
    plugins: [
        require('autoprefixer'),
        require('css-mqpacker'),
        require('cssnano')({
            preset: [
                'default', {
                    discardComments: {
                        removeAll: true,
                    },
                },
            ],
        }),
        // require('@fullhuman/postcss-purgecss')({
        //     content: [
        //         './src/**/*.pug',
        //         './src/**/*.js',
        //         './src/**/*.scss',
        //         './build/*.html',
        //     ],
        //     css: ['*.css'],
        //     variables: true,
        //     keyframes: true,
        //     fontFace: true,
        //     rejected: true,
        //     whitelist: [
        //     ],
        //     whitelistPatterns: [/ps|ya-share|swiper|qs-/],
        //     extractors: [{
        //         extractor: purgecssFromPug,
        //         extensions: ['pug']}
        //     ]
        // }),
        require('postcss-reporter')({
            filter: () => true,
        }),
    ],
};
