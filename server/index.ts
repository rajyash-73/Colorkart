import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function startDevServer() {
  console.log('Starting client-side development server...');
  
  const server = await createServer({
    configFile: path.join(rootDir, 'client', 'vite.config.js'),
    root: path.join(rootDir, 'client'),
    server: {
      port: 5000,
      host: '0.0.0.0',
      hmr: {
        clientPort: 443
      },
      strictPort: true,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      allowedHosts: [
        'localhost',
        '0.0.0.0',
        '172.31.128.17',
        'a7c2b0e9-c4bd-4912-9db6-d8e76a014543-00-1m0y5conrqvbj.riker.replit.dev',
        '.replit.dev',
        '.repl.co'
      ]
    }
  });

  await server.listen();
  server.printUrls();
}

startDevServer().catch(err => {
  console.error('Error starting dev server:', err);
  process.exit(1);
});