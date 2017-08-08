/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const pkg = require(path.resolve(process.cwd(), "package.json"));

const plugins = [
  new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
    templateContent: templateContent() // eslint-disable-line no-use-before-define
  }),
  new CircularDependencyPlugin({
    exclude: /a\.js|node_modules/, // exclude node_modules
    failOnError: false // show a warning when there is a circular dependency
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
    children: true,
    minChunks: 2,
    async: true
  })
];

module.exports = require("./webpack.base")({
  // Add hot reloading in development
  entry: [
    "eventsource-polyfill", // Necessary for hot reloading with IE
    "webpack-hot-middleware/client?reload=true",
    path.join(process.cwd(), "src/index.js") // Start with js/app.js
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js"
  },

  // Add development plugins
  plugins: plugins, // eslint-disable-line no-use-before-define

  // Emit a source map for easier debugging
  devtool: "cheap-module-eval-source-map",

  performance: {
    hints: false
  }
});

/**
 * We dynamically generate the HTML content in development so that the different
 * DLL Javascript files are loaded in script tags and available to our application.
 */
function templateContent() {
  const html = fs
    .readFileSync(path.resolve(process.cwd(), "src/index.html"))
    .toString();

  return html;
}
