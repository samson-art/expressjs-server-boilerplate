import fs from 'fs';
import path from 'path';
// @ts-ignore
import React from 'react';
// @ts-ignore
import { renderToString } from 'react-dom/server';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - path is relative to project root during ts-node
import { App } from '../client/src/ui/App';

function injectMarkupIntoIndexHtml(html: string, appHtml: string): string {
  return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

async function main(): Promise<void> {
  const outDir = path.join(process.cwd(), 'client', 'dist', 'client');
  const indexPath = path.join(outDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('client/dist/client/index.html not found. Run "npm run build:client" first.');
  }
  const builtHtml = fs.readFileSync(indexPath, 'utf-8');
  const appHtml = renderToString(React.createElement(App));
  const finalHtml = injectMarkupIntoIndexHtml(builtHtml, appHtml);
  fs.writeFileSync(indexPath, finalHtml, 'utf-8');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


