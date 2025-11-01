import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TlsCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'production') {
      const proto = req.headers['x-forwarded-proto'] || req.protocol;

      if (proto !== 'https') {
        throw new ForbiddenException('HTTPS required');
      }
    }

    next();
  }
}
