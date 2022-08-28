import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LikeStatusValidationMiddleware implements NestMiddleware {
  // @InjectModel(Attempt.name) private attemptModel: Model<Attempt>;
  async use(req: Request, res: Response, next: NextFunction) {
    const likeStatus: string = req.body.likeStatus;
    let errorMessages:any;
    if (likeStatus.length > 21 || likeStatus.length < 1) {
      errorMessages = {
        errors: [
          {
            message: 'wrong likestatus',
            field: 'likeStatus',
          },
        ],
      };
          return res.status(400).json(errorMessages);
    }
    next();
  }
}
