module.exports = {
    mode: 'universal',
    router: {
        middleware: 'i18n',
    },
    telemetry: false,
    /*
     ** Headers of the page
     */
    head: {
        title: 'helmet1.0' || process.env.npm_package_name,
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0',
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || '',
            },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        script: [
            // {
            //   src: "/js/iconfont.js"
            // },
            // {
            //   src: "/js/tronweb.js"
            // }
        ],
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },
    /*
     ** Global CSS
     */
    css: ['~assets/css/main.scss', '~assets/css/animate.css'],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '~plugins/i18n.js',
        '~plugins/bus-inject.js',
        '~plugins/filter.js',
        '~plugins/c-ui.js',
    ],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [],
    /*
     ** Nuxt.js modules
     */
    // axios和proxy 暂时用不上
    // modules: ["@nuxtjs/axios", "@nuxtjs/proxy"],
    // axios: {
    //   proxy: true
    // },
    // proxy: {
    //   "/baseapi": {
    //     target: "https://tronsage.bitank.com",
    //     pathRewrite: {
    //       "^/baseapi": "/"
    //     }
    //   }
    // },
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {},
    },
    generate: {
        dir: 'docs',
        subFolders: false,
    },
};
