import type { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, _: Response, next: NextFunction) => {
    const path = req.path;
    const method = req.method;
    console.info(`[${new Date().toISOString()}] ${method} ${path}`);
    next();
  }