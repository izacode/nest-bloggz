import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeStatusValidationMiddleware } from '../middleware/likeStatus-validation.middleware';

import { ReactionsRepository } from '../likes/reactions.repository';
import { ReactionsService } from '../likes/reactions.service';
import { Blogger, BloggerSchema } from '../schemas/blogger.schema';
import {
  CommentReaction,
  CommentReactionSchema,
} from '../schemas/comment-reaction.schema';
import { Comment, CommentSchema } from '../schemas/comment.schema';
import {
  PostReaction,
  PostReactionSchema,
} from '../schemas/post-reaction.schema';
import { Post, PostSchema } from '../schemas/post.schema';

import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: Blogger.name,
        schema: BloggerSchema,
      },
      {
        name: CommentReaction.name,
        schema: CommentReactionSchema,
      },
      {
        name: PostReaction.name,
        schema: PostReactionSchema,
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    ReactionsService,
    ReactionsRepository,
    JwtService,
  ],
  exports: [CommentsService, CommentsRepository],
})
export class CommentsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LikeStatusValidationMiddleware)
      .forRoutes({ path: 'comments/:id/like-status', method: RequestMethod.PUT },);
  }
}
