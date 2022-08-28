import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LikeStatusValidationMiddleware implements NestMiddleware {
  // @InjectModel(Attempt.name) private attemptModel: Model<Attempt>;
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('inside LikeStatusValidationMiddleware');
    if (req.body.likeStatus) {
      console.log('inside LikeStatusValidationMiddleware iffff');
      const likeStatus: string = req.body.likeStatus;
      let errors: any;
      if (likeStatus.length > 21 || likeStatus.length < 1) {
        console.log('inside LikeStatusValidationMiddleware iffff2');
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
