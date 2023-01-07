"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPage = exports.bundle = exports.build = void 0;
const path_1 = require("path");
const vite_1 = require("vite");
const constants_1 = require("./constants");
const fs = require("fs-extra");
const plugin_react_1 = require("@vitejs/plugin-react");
async function build(root = process.cwd()) {
    const [clientBundle, serverBundle] = await bundle(root);
    const serverEntryPath = (0, path_1.join)(root, '.temp', 'ssr-entry.js');
    const { render } = require(serverEntryPath);
    renderPage(render, root, clientBundle);
}
exports.build = build;
async function bundle(root) {
    const resolveViteConfig = (isServer) => ({
        mode: 'production',
        root,
        build: {
            outDir: isServer ? '.temp' : 'build',
            ssr: isServer,
            rollupOptions: {
                input: isServer ? constants_1.SERVER_ENTRY_PATH : constants_1.CLIENT_ENTRY_PATH,
                output: {
                    format: isServer ? 'cjs' : 'esm'
                },
            },
        },
        plugins: [(0, plugin_react_1.default)()]
    });
    console.log(`Building client + server bundles...`);
    try {
        const [clientBundle, serverBundle] = await Promise.all([
            (0, vite_1.build)(resolveViteConfig(false)),
            (0, vite_1.build)(resolveViteConfig(true)),
        ]);
        return [clientBundle, serverBundle];
    }
    catch (error) {
        console.error(error);
    }
}
exports.bundle = bundle;
async function renderPage(render, root, clientBundle) {
    const clientChunk = clientBundle.output.find(chunk => chunk.type === 'chunk' && chunk.isEntry);
    console.log(`Rendering page in server side...`);
    const appHtml = render();
    const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>title</title>
      <meta name="description" content="xxx">
    </head>
    <body>
      <div id="root">${appHtml}</div>
      <script type="module" src="/${clientChunk?.fileName}"></script>
    </body>
  </html>`.trim();
    await fs.ensureDir((0, path_1.join)(root, "build"));
    await fs.writeFile((0, path_1.join)(root, "build/index.html"), html);
    await fs.remove((0, path_1.join)(root, ".temp"));
}
exports.renderPage = renderPage;
