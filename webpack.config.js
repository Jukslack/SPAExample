const path = require("path");
const WebpackCleanPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
//const typescript = require("typescript")

module.exports = {
    entry: {
        app: "./src/js/index.ts"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    module:{
        rules:[
            { 
                test: /\.txt$/, use: "raw-loader"
            },
            {
                test: /\.css$/, use: ["style-loader", "css-loader"]
            },
            {
                test: /\.png|jpg|svg|gif$/, use: "file-loader"
            },
            {
                test: /\.tsx$/, use: "ts-loader", exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".tsx",".ts",".js"]
    },
    plugins:[
        new WebpackCleanPlugin(['dist']),
        new HtmlWebpackPlugin({template: "./src/index.html"}),
        new CopyWebpackPlugin([
            {
                from: "src/components/**/*",
                to: "components/[name].[ext]",
                toType: "template"
            }
        ],{ignore: ["*.js","*.css"]}),
        new CopyWebpackPlugin([
            {
                from: "src/data/*",
                to: "data/[name].[ext]",
                toType: "template"
            }
        ],{ignore: ["*.js","*.css", "*.html"]}),
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery: "jquery"
        }),
        new webpack.ProvidePlugin({
            Ractive: ["ractive/ractive.min.js", "default"]
        })
    ],
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist"
    },
    mode: "production"
}