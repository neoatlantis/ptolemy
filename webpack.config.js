const fs = require("fs");
const path = require('path');

const DefinePlugin = require("webpack").DefinePlugin;
const CopyPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')

const package_json = JSON.parse(fs.readFileSync("./package.json"));





module.exports = (env)=>{
    const VERSION = package_json.version;
    const PROGRAM_NAME = env.program_name ? env.program_name : "Ptolemy";
    const program_prefix = PROGRAM_NAME.replace(/[^a-z0-9]/gi, "-").toLowerCase();


    const is_dev = (env.production === undefined);

    const output_path = __dirname;

    const common_srcpath = path.join(__dirname, "common");

    const generic_rules = [
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.(vue|js)$/,
            loader: 'ifdef-loader',
            exclude: /node_modules/,
            options: {
                DEV: is_dev,
            }
        },
        {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        // enable CSS Modules
                        modules: true,
                    }
                }
            ],
        }

    ];

    const generic_plugins = [
        new DefinePlugin({
            VERSION: JSON.stringify(VERSION),
            PROGRAM_NAME: JSON.stringify(PROGRAM_NAME),
            PROGRAM_PREFIX: JSON.stringify(program_prefix),
            DEV: JSON.stringify(is_dev),
        }),
        new HtmlReplaceWebpackPlugin([
            {
                pattern: '[[[PROGRAM NAME]]]',
                replacement: PROGRAM_NAME,
            },
            {
                pattern: '[[[PROGRAM VERSION]]]',
                replacement: VERSION,
            }
        ]),
    ];


    let ret = [];

    let web_srcpath = path.join(__dirname, "ptolemy-src");
    let web_dstpath = path.join(
        __dirname,
        "build",
        program_prefix + "." + (is_dev?"dev":"dist")
    );


    function web_template(scriptname, pagename){ return {
        entry: path.resolve(web_srcpath, scriptname),
        mode: is_dev?'development':'production',
        watch: true,
        output: {
            filename: scriptname,
            path: web_dstpath,
        },
        resolve: {
            alias: {
                app: web_srcpath,
                common: common_srcpath,
                sfc: path.resolve(web_srcpath, "vue"),
            },
        },
        module: {
            rules: generic_rules, 
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: path.join(web_srcpath, pagename),
                filename: path.join(web_dstpath, pagename),
                scriptLoading: "module",
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.join(web_srcpath, "static"),
                        to:   path.join(web_dstpath, "static"),
                    }
                ]
            }),
        ].concat(generic_plugins),

    } }

    ret.push(web_template("page.index.js", "index.html"));

    return ret;
};
