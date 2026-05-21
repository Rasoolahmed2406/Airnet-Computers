import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Custom middleware to act as a local shared records database server
const recordsDbPlugin = () => ({
  name: 'records-db-plugin',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url === '/api/records' || req.url === '/api/records/') {
        const filePath = path.resolve(__dirname, 'records.json');
        
        if (req.method === 'GET') {
          let records = [];
          if (fs.existsSync(filePath)) {
            try {
              records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            } catch (e) {
              console.error('Failed to parse records.json:', e);
            }
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(records));
          return;
        }
        
        if (req.method === 'PUT' || req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              fs.writeFileSync(filePath, body, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (e) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Failed to write records' }));
            }
          });
          return;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig(async () => {
  const plugins = [react(), tailwindcss(), recordsDbPlugin()];
  try {
    // @ts-ignore
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {}
  return { plugins, base: './' };
})
