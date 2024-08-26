const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    static: "./dist",
    watchFiles: ["./src/index.html"],
  },
};
