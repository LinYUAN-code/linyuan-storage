const path = require("path");
console.log(__dirname);
require("esbuild").build({
    entryPoints: [path.join(__dirname,"../src","index.ts")],
    bundle: true,
    outdir: path.join(__dirname,"..","dist")
}).catch((err)=>{
    console.log("构建失败: ",err);
})