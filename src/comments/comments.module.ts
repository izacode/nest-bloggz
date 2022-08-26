import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { EmailAdapter } from 'src/emails/email.adapter';
import { EmailManager } from 'src/emails/email.manager';
import { EmailService } from 'src/emails/email.service';
import { ReactionsRepository } from 'src/likes/reactions.repository';
import { ReactionsService } from 'src/likes/reactions.service';
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
import { UsersRepository } from 'src/users/users.repository';
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
export class CommentsModule {}
