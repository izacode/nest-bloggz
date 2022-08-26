import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersModule } from 'src/bloggers/bloggers.module';
import { CommentsModule } from 'src/comments/comments.module';
import { Blogger, BloggerSchema } from 'src/schemas/blogger.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { forwardRef} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReactionsRepository } from 'src/likes/reactions.repository';
import { CommentReaction, CommentReactionSchema } from 'src/schemas/comment-reaction.schema';
import { PostReaction, PostReactionSchema } from 'src/schemas/post-reaction.schema';
import { ReactionsService } from 'src/likes/reactions.service';

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
export class PostsModule {}
