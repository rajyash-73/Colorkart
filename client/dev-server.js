import { createServer } from 'vite';

async function startDevServer() {
  const server = await createServer({
    // The server will use the Vite config from the root directory
    configFile: '../vite.config.ts',
    root: './client',
    server: {
      port: 5000,
      host: '0.0.0.0',
    },
  });

  await server.listen();
  
  server.printUrls();
  
  // Handle SIGINT (Ctrl+C) to gracefully shut down the server
  process.on('SIGINT', () => {
    server.close().then(() => {
      console.log('Vite dev server closed');
      process.exit();
    });
  });
}

startDevServer();