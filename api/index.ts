import type { Express, Request, Response } from 'express';

let appPromise: Promise<Express> | undefined;

async function getApiApp() {
  if (!appPromise) {
    appPromise = import('../server').then(({ createApiApp }) => createApiApp());
  }

  return appPromise;
}

export default async function handler(req: Request, res: Response) {
  try {
    console.log('[api] incoming request', req.method, req.url);
    const app = await getApiApp();
    return app(req, res);
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
