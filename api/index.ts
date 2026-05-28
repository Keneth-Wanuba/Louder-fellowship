import type { Express, Request, Response } from 'express';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let app: Express | undefined;

function getApiApp() {
  if (!app) {
    const server = require('../dist/server.cjs') as { createApiApp: () => Express };
    app = server.createApiApp();
  }

  return app;
}

export default async function handler(req: Request, res: Response) {
  try {
    console.log('[api] incoming request', req.method, req.url);
    const apiApp = getApiApp();
    return apiApp(req, res);
  } catch (error: any) {
    console.error('[api] failed before Express handled request', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
    });

    if (!res.headersSent) {
      return res.status(500).json({
        error: 'API function failed to initialize.',
        details: error?.message || String(error),
        code: error?.code,
      });
    }
  }
}
