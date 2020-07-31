const path = require("path");

function resolve(url) {
  return path.join(__dirname, url);
}

const isDev = process.env.NODE_ENV === "development";

console.log(isDev)

module.exports = {
  publicPath: "./",
  lintOnSave: false,
  pages: {
    index: {
      entry: "example/main.js",
      template: isDev ? "public/index.html" : "public/build.html",
      filename: "index.html",
    },
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@utils", resolve("src/utils"));
  },

  configureWebpack: {
    externals: !isDev
      ? {
          vue: "Vue",
          axios: "axios",
          "element-ui": "Element",
        }
      : {},
  },

  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/style/global.scss";`,
      },
    },
  },

  devServer: {
    port: 9898,
    open: true,
  },
};
