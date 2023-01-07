// node_modules/.pnpm/tsup@6.5.0_typescript@4.9.3/node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/node/cli.ts
import cac from "cac";

// src/node/dev.ts
import { createServer } from "vite";

// src/node/plugin-island/indexHtml.ts
import { readFile } from "fs/promises";

// src/node/constants/index.ts
import * as path2 from "path";
var PACKAGE_ROOT = path2.join(__dirname, "..");
var DEFAULT_TEMPLATE_PATH = path2.join(PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = path2.join(PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");
var SERVER_ENTRY_PATH = path2.join(PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");

// src/node/plugin-island/indexHtml.ts
function pluginIndexHtml() {
  return {
    name: "island:index-html",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let content = await readFile(DEFAULT_TEMPLATE_PATH, "utf-8");
          content = await server.transformIndexHtml(
            req.url,
            content,
            req.originalUrl
          );
          res.setHeader("Content-Type", "text/html");
          res.end(content);
        });
      };
    }
  };
}

// src/node/dev.ts
import pluginReact from "@vitejs/plugin-react";
function createDevServer(root) {
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  });
}

// src/node/build.ts
import { join as join2 } from "path";
import { build as viteBuild } from "vite";
import fs from "fs-extra";
import { pathToFileURL } from "url";
import pluginReact2 from "@vitejs/plugin-react";
async function build(root = process.cwd()) {
  const [clientBundle, serverBundle] = await bundle(root);
  const serverEntryPath = join2(root, ".temp", "ssr-entry.js");
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  renderPage(render, root, clientBundle);
}
async function bundle(root) {
  const resolveViteConfig = (isServer) => ({
    mode: "production",
    root,
    build: {
      outDir: isServer ? ".temp" : "build",
      ssr: isServer,
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? "cjs" : "esm"
        }
      }
    },
    plugins: [pluginReact2()]
  });
  console.log(`Building client + server bundles...`);
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true))
    ]);
    return [clientBundle, serverBundle];
  } catch (error) {
    console.error(error);
  }
}
async function renderPage(render, root, clientBundle) {
  const clientChunk = clientBundle.output.find((chunk) => chunk.type === "chunk" && chunk.isEntry);
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
      <script type="module" src="/${clientChunk?.fileName}"><\/script>
    </body>
  </html>`.trim();
  await fs.ensureDir(join2(root, "build"));
  await fs.writeFile(join2(root, "build/index.html"), html);
  await fs.remove(join2(root, ".temp"));
}

// src/node/cli.ts
import { resolve } from "path";
var cli = cac("island").version("0.0.1").help();
cli.command("dev [root]", "start dev server").action(async (root) => {
  console.log("dev", root);
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});
cli.command("build [root]", "build in production").action(async (root) => {
  console.log("build", root);
  try {
    root = resolve(root);
    await build(root);
  } catch (error) {
    console.log(error);
  }
});
cli.parse();
