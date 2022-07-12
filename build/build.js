const path = require("path");
const { nodeExternalsPlugin } = require('esbuild-node-externals');

console.log(__dirname);
require("esbuild").build({
    entryPoints: [path.join(__dirname,"../src","index.ts")],
    outdir: path.join(__dirname,"..","dist"),
    // minify: true,
    format: "esm",
    bundle: true,
    plugins: [nodeExternalsPlugin()],
}).catch((err)=>{
    console.log("构建失败: ",err);
})