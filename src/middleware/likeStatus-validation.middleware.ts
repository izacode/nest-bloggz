import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LikeStatusValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers === undefined && Object.keys(req.body).length === 0) throw new UnauthorizedException()
      const statuses = ['Like', 'Dislike', 'None'];
    if (!statuses.includes(req.body.likeStatus)) {
      let errors = {
        errorsMessages: [
          {
            message: 'wrong likestatus',
            field: 'likeStatus',
          },
        ],
      };

      return res.status(400).json(errors);
    }

    next();
  }
}
