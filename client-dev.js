import { createServer } from 'vite';

async function startDevServer() {
  const server = await createServer({
    configFile: './vite.config.ts',
    root: './client',
    server: {
      port: 5000,
      host: '0.0.0.0'
    }
  });

  await server.listen();
  server.printUrls();
}

startDevServer().catch(err => {
  console.error('Error starting dev server:', err);
  process.exit(1);
});