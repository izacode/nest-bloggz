import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from 'src/comments/comments.controller';
import { CommentsRepository } from 'src/comments/comments.repository';
import { CommentsService } from 'src/comments/comments.service';
import { PostsController } from 'src/posts/posts.controller';
import { PostsRepository } from 'src/posts/posts.repository';
import { PostsService } from 'src/posts/posts.service';
import { Blogger, BloggerSchema } from 'src/schemas/blogger.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { BloggersController } from './bloggers.controller';
import { BloggersRepository } from './bloggers.repository';
import { BloggersService } from './bloggers.service';

@Module({
  imports: [
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
    ]),
  ],
  controllers: [CommentsController, PostsController, BloggersController],
  providers: [
    CommentsService,
    CommentsRepository,
    PostsService,
    PostsRepository,
    BloggersService,
    BloggersRepository,
  ],
})
export class BloggersModule {}