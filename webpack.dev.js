const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
};
