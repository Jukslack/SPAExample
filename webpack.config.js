//const webpack= require("webpack");
const path = require("path");
const WebpackCleanPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        app: "./src/js/index.js"
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
            }
        ]
    },
    plugins:[
        new WebpackCleanPlugin(['dist']),
        new HtmlWebpackPlugin({template: "./src/index.html"})
    ],
    mode: "production"
}