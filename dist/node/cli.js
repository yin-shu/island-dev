"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const dev_1 = require("./dev");
const build_1 = require("./build");
const path_1 = require("path");
// import { resolve } from 'root'
const cli = (0, cac_1.default)('island').version('0.0.1').help();
cli.command('dev [root]', 'start dev server').action(async (root) => {
    console.log('dev', root);
    const server = await (0, dev_1.createDevServer)(root);
    await server.listen();
    server.printUrls();
});
cli.command('build [root]', 'build in production').action(async (root) => {
    console.log('build', root);
    try {
        root = (0, path_1.resolve)(root);
        await (0, build_1.build)(root);
    }
    catch (error) {
        console.log(error);
    }
});
cli.parse();
