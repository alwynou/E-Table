const path = require('path')

function resolve(url) {
    return path.join(__dirname, url)
}

module.exports = {
    publicPath:'./',

    lintOnSave: false,

    pages: {
        index: {
            entry: 'example/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },

    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@utils', resolve('src/utils'))
    },

    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/style/global.scss";`
            }
        }
    },

    devServer: {
        port: 9898,
        open: true
    }
}