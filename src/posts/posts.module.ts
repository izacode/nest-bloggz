import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersModule } from '../bloggers/bloggers.module';
import { CommentsModule } from '../comments/comments.module';
import { Blogger, BloggerSchema } from '../schemas/blogger.schema';
import { Comment, CommentSchema } from '../schemas/comment.schema';
import { Post, PostSchema } from '../schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReactionsRepository } from '../likes/reactions.repository';
import {
  CommentReaction,
  CommentReactionSchema,
} from '../schemas/comment-reaction.schema';
import {
  PostReaction,
  PostReactionSchema,
} from '../schemas/post-reaction.schema';
import { ReactionsService } from '../likes/reactions.service';
import { LikeStatusValidationMiddleware } from '../middleware/likeStatus-validation.middleware.';

@Module({
  imports: [
    forwardRef(() => BloggersModule),
    CommentsModule,
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: Blogger.name,
        schema: BloggerSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
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
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    JwtService,
    ReactionsRepository,
    ReactionsService,
  ],
  exports: [PostsService, PostsRepository],
})
export class PostsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LikeStatusValidationMiddleware)
      .forRoutes(
        'posts/:id/like-status',
      );
  }
}
