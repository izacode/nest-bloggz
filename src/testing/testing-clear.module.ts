import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attempt, AttemptSchema } from 'src/schemas/attempt.schema';
import { Blogger, BloggerSchema } from 'src/schemas/blogger.schema';
import {
  CommentReaction,
  CommentReactionSchema,
} from 'src/schemas/comment-reaction.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import {
  PostReaction,
  PostReactionSchema,
} from 'src/schemas/post-reaction.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { TestingClearController } from './testing-clear.controller';
import { TestingClearService } from './testing-clear.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
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
      {
        name: Attempt.name,
        schema: AttemptSchema,
      },
    ]),
  ],
  controllers: [TestingClearController],
  providers: [TestingClearService],
})
export class TestingClearModule {}
