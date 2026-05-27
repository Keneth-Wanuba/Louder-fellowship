import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../server';

const appPromise = createApp({ includeFrontend: false });

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
  }

  const app = await appPromise;
  return app(req, res);
}
