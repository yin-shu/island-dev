import cac from 'cac';
import { build } from './build';
import { resolve } from 'path';
// import { resolve } from 'root'

const cli = cac('island').version('0.0.1').help();

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  console.log('dev', root);
  const createServer = async () => {
    const { createDevServer } = await import('./dev');
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  await createServer();
});

cli
  .command('build [root]', 'build in production')
  .action(async (root: string) => {
    console.log('build', root);
    try {
      root = resolve(root);
      await build(root);
    } catch (error) {
      console.log(error);
    }
  });

cli.parse();
