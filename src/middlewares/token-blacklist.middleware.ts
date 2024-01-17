import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CacheService } from '../modules/cache/cache.service';
import { TOKEN_BLACK_LIST } from '../constants/cache.constant';
import { BLACKLIST_TOKEN } from '../constants/error-codes.constant';

@Injectable()
export class TokenBlacklistMiddleware implements NestMiddleware {
  constructor(private cacheService: CacheService) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  async use(req: Request, res: Response, next: Function) {
    const authorization = req.headers?.authorization;

    if (authorization) {
      const splits = authorization.split(' ');
      if (splits.length > 1) {
        const token = splits[1];

        if (token) {
          const existTokenBlacklist = await this.cacheService.get(
            `${TOKEN_BLACK_LIST}${token}`,
          );

          if (existTokenBlacklist) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
              code: BLACKLIST_TOKEN,
            });
          }
        }
      }
    }

    next();
  }
}
