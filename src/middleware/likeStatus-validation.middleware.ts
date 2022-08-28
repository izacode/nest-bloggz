import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LikeStatusValidationMiddleware implements NestMiddleware {
  // @InjectModel(Attempt.name) private attemptModel: Model<Attempt>;
  async use(req: Request, res: Response, next: NextFunction) {
    if (typeof req.body.likeStatus === 'string') {
      const likeStatus: string = req.body.likeStatus;
      let errors: any;
      if (likeStatus.length > 20 || likeStatus === '') {
        errors = {
          errorsMessages: [
            {
              message: 'wrong likestatus',
              field: 'likeStatus',
            },
          ],
        };
        return res.status(400).json(errors);
      }
    }

    next();
  }
}
